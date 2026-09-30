import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "EMPLOYEE";
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader =
    req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authentication token required.",
    });
  }

  const [type, token] =
    authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization format.",
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "JWT configuration error.",
    });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        secret
      ) as TokenPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

export function authorizeRoles(
  ...allowedRoles: Array<
    "ADMIN" | "TECHNICIAN" | "EMPLOYEE"
  >
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "You do not have permission to perform this action.",
      });
    }

    next();
  };
}