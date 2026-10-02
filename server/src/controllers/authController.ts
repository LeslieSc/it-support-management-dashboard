import type {
  NextFunction,
  Request,
  Response,
} from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  pool,
} from "../config/database.js";

type UserRole =
  | "ADMIN"
  | "TECHNICIAN"
  | "EMPLOYEE";

function createToken(
  userId: number,
  email: string,
  role: UserRole
) {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    {
      userId,
      email,
      role,
    },
    secret,
    {
      expiresIn: "8h",
    }
  );
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    const role: UserRole =
      "EMPLOYEE";

    const normalizedEmail =
      email.toLowerCase();

    const existingUser =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [
          normalizedEmail,
        ]
      );

    if (
      existingUser.rows.length >
      0
    ) {
      return res.status(409).json({
        message:
          "A user with this email already exists.",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const result =
      await pool.query(
        `
        INSERT INTO users (
          full_name,
          email,
          password_hash,
          role
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        RETURNING
          id,
          full_name AS "fullName",
          email,
          role
        `,
        [
          fullName,
          normalizedEmail,
          passwordHash,
          role,
        ]
      );

    const user =
      result.rows[0];

    const token =
      createToken(
        user.id,
        user.email,
        user.role
      );

    return res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email.toLowerCase();

    const result =
      await pool.query(
        `
        SELECT
          id,
          full_name
            AS "fullName",
          email,
          password_hash
            AS "passwordHash",
          role
        FROM users
        WHERE email = $1
        `,
        [
          normalizedEmail,
        ]
      );

    if (
      result.rows.length ===
      0
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const user =
      result.rows[0];

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (
      !passwordMatches
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const token =
      createToken(
        user.id,
        user.email,
        user.role
      );

    return res.json({
      user: {
        id:
          user.id,
        fullName:
          user.fullName,
        email:
          user.email,
        role:
          user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}