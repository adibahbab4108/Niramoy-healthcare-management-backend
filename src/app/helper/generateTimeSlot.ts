interface GenerateSlotsParams {
    startTime: string;
    endTime: string;
    startDate: Date;
    endDate: Date;
    intervalTime: number; // in minutes
}

export interface Slot {
    start: Date;
    end: Date;
}

export function generateSlots({
    startTime,
    endTime,
    startDate,
    endDate,
    intervalTime,
}: GenerateSlotsParams): Slot[] {
    const slots: Slot[] = [];
    // Parse startTime
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const slotStart = new Date(startDate);
    slotStart.setHours(startHour, startMinute, 0, 0);

    // Parse endTime
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const finalEnd = new Date(endDate);
    finalEnd.setHours(endHour, endMinute, 0, 0);

    let currentStart = new Date(slotStart);

    while (currentStart < finalEnd) {
        const currentEnd = new Date(currentStart);
        currentEnd.setMinutes(currentEnd.getMinutes() + intervalTime);

        if (currentEnd > finalEnd) break;

        slots.push({
            start: new Date(currentStart),
            end: new Date(currentEnd),
        });

        currentStart = currentEnd;
    }

    return slots;
}
