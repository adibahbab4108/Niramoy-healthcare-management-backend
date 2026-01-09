import { prisma } from "../../lib/prisma"
import { IJWTPayload } from "../../types/common"

const insertIntoDB = async (user: IJWTPayload, payload: { shceduleIds: string[] }) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorScheduleData = payload.shceduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))
    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
}
export const DoctorScheduleService = {
    insertIntoDB
}
