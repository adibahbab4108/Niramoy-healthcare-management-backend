import { addMinutes, addHours, format } from "date-fns";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../../prisma/generated/prisma/client";
import { IJWTPayload } from "../../types/common";
import { generateSlots, Slot } from "../../helper/generateTimeSlot";


const insertIntoDB = async (payload: any) => {
    const { startTime, endTime, startDate: startDateStr, endDate: endDateStr } = payload;

    // Convert string dates to Date objects if they're strings (adjust based on your payload type)
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const intervalTime = 30; // minutes

    // Generate ALL slots across the entire date range in one go
    const allSlots: Slot[] = generateSlots({
        startTime,
        endTime,
        startDate,
        endDate,
        intervalTime,
    });

    const schedules = [];

    // Insert non-existing slots into DB
    for (const slot of allSlots) {
        const scheduleData = {
            startDateTime: slot.start,
            endDateTime: slot.end,
        };

        const existingSchedule = await prisma.schedule.findFirst({
            where: {
                startDateTime: scheduleData.startDateTime,
                endDateTime: scheduleData.endDateTime,
            },
        });

        if (!existingSchedule) {
            const result = await prisma.schedule.create({
                data: scheduleData,
            });
            schedules.push(result);
        }
    }

    return schedules;
};


const schedulesForDoctor = async (
    user: IJWTPayload,
    fillters: any,
    options: IOptions
) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = fillters;

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


    const doctorSchedules = await prisma.doctorSchedule.findMany({
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