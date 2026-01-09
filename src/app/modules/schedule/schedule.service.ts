import { paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../lib/prisma";
import { IJWTPayload } from "../../types/common";
import { timeSlotHelper } from "../../helper/generateTimeSlot";
import { Prisma } from "../../../../prisma/generated/prisma/client";


const insertIntoDB = async (payload: TimeSlotPayload) => {
    const { startTime, endTime, startDate, endDate } = payload;
    const intervalTime = 30; // minutes

    // 1. Generate all desired slots for the date range
    const allSlots: TimeSlot[] = timeSlotHelper.generateTimeSlots({
        startTime,
        endTime,
        startDate,
        endDate,
        intervalTime,
    });

    if (allSlots.length === 0) {
        return [];
    }

    // 2. Extract the start/end pairs to check against DB
    const desiredSlotPairs = allSlots.map(slot => ({
        startDateTime: slot.slotStart,
        endDateTime: slot.slotEnd,
    }));

    // await prisma.schedule.deleteMany({});
    // return

    // 3. Find which of these slots ALREADY exist in the database
    const existingSlots = await prisma.schedule.findMany({
        where: {
            OR: desiredSlotPairs.map(pair => ({
                startDateTime: pair.startDateTime,
                endDateTime: pair.endDateTime,
            })),
        },
        select: {
            startDateTime: true,
            endDateTime: true,
        },
    });

    // 4. Create a Set of existing slot identifiers for fast lookup
    const existingSlotKeySet = new Set(
        existingSlots.map((slot: { startDateTime: { toISOString: () => any; }; endDateTime: { toISOString: () => any; }; }) =>
            `${slot.startDateTime.toISOString()}|${slot.endDateTime.toISOString()}`
        )
    );

    // 5. Filter only the NEW slots that don't exist yet
    const newSlotsToInsert = desiredSlotPairs.filter(
        slot =>
            !existingSlotKeySet.has(
                `${slot.startDateTime.toISOString()}|${slot.endDateTime.toISOString()}`
            )
    );

    // 6. Bulk insert only the missing ones (safe even if called multiple times)
    if (newSlotsToInsert.length > 0) {
        await prisma.schedule.createMany({
            data: newSlotsToInsert,
            skipDuplicates: true, // extra safety
        });
    }

    // 7. Return all slots in the requested range (existing + newly created)
    return await prisma.schedule.findMany({
        where: {
            OR: desiredSlotPairs.map(s => ({
                startDateTime: s.startDateTime,
                endDateTime: s.endDateTime,
            })),
        },
        orderBy: {
            startDateTime: 'asc',
        },
    });
};

const schedulesForDoctor = async (
    user: IJWTPayload,
    filters: any,
    options: IOptions
) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters;
    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}


    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}


const deleteScheduleFromDB = async (id: string) => {

    return await prisma.schedule.delete({
        where: {
            id
        }
    })
}

export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}
