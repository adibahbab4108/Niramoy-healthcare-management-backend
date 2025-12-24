// import { NextFunction, Request, Response } from "express"
// import httpStatus from "http-status"

// const notFound = (req: Request, res: Response, next: NextFunction) => {
//     res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         message: "API NOT FOUND!",
//         error: {
//             path: req.originalUrl,
//             message: "Your requested path is not found!"
//         }
//     })
// };

// export default notFound;

import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export default notFound;
