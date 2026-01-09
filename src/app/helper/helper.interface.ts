// Pagination Helper Interfaces start................
interface IOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}

interface IOptionsResult {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}
// Pagination Helper Interfaces end................

// Time Slot Helper Interfaces start................
interface TimeSlot {
    slotStart: Date;
    slotEnd: Date;
}
interface TimeSlotPayload {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    intervalTime: number; // in minutes
}
// Time Slot Helper Interfaces end................