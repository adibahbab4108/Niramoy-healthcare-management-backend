import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertSchedule(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule inserted successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertSchedule,
};
