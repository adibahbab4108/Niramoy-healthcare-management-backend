import { addHours, addMinutes, format } from "date-fns";

const insertSchedule = (payload: any) => {
  const { startDateTime, endDateTime, startTime, endTime } = payload;
  const intervalTime = 30;

  const currentDate = new Date(startDateTime);
  const lastDate = new Date(endDateTime);
  while (currentDate <= lastDate) {
    const startDateTime = new Date(addMinutes(addHours(currentDate, startTime), endTime));
  }
  console.log("Inserted schedule from", currentDate, "to", lastDate);
  return payload;
};
export const ScheduleService = {
  insertSchedule,
};
