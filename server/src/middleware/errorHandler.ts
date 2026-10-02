import type {
  NextFunction,
  Request,
  Response,
} from "express";

export function notFoundHandler(
  req: Request,
  res: Response
) {
  return res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(
    `[${req.method}] ${req.originalUrl}`,
    error
  );

  return res.status(500).json({
    message: "Internal server error",
  });
}