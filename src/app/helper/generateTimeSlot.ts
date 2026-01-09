function generateTimeSlots(payload: TimeSlotPayload): TimeSlot[] {
    const { startDate, endDate, startTime, endTime, intervalTime } = payload;

    const slots: TimeSlot[] = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    while (currentDate <= lastDate) {
        // Set the daily start time (e.g., 2026-12-10T09:00:00)
        const dayStart = new Date(currentDate);
        dayStart.setHours(startHour, startMinute, 0, 0);

        // Set the daily end time (e.g., 2026-12-10T17:30:00)
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(endHour, endMinute, 0, 0);

        // If dayEnd is before dayStart (e.g., endTime = 02:00 next day), add 1 day
        if (dayEnd <= dayStart) {
            dayEnd.setDate(dayEnd.getDate() + 1);
        }

        let current = new Date(dayStart);

        while (true) {
            const slotEnd = new Date(current);
            slotEnd.setMinutes(slotEnd.getMinutes() + intervalTime);

            if (slotEnd > dayEnd) break;

            slots.push({
                slotStart: new Date(current),
                slotEnd: new Date(slotEnd),
            });

            current = slotEnd;
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
}
export const timeSlotHelper = {
    generateTimeSlots,
}