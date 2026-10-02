import jwt from "jsonwebtoken";
import request from "supertest";

import {
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

describe(
  "Role-based authorization",
  () => {
    let adminToken: string;
    let technicianToken: string;
    let employeeToken: string;

    beforeAll(() => {
      const secret =
        process.env.JWT_SECRET;

      if (!secret) {
        throw new Error(
          "JWT_SECRET is required for tests."
        );
      }

      adminToken = jwt.sign(
        {
          userId: 1,
          email:
            "leslie@example.com",
          role: "ADMIN",
        },
        secret,
        {
          expiresIn: "1h",
        }
      );

      technicianToken =
        jwt.sign(
          {
            userId: 3,
            email:
              "technician@example.com",
            role: "TECHNICIAN",
          },
          secret,
          {
            expiresIn: "1h",
          }
        );

      employeeToken =
        jwt.sign(
          {
            userId: 2,
            email:
              "employee@example.com",
            role: "EMPLOYEE",
          },
          secret,
          {
            expiresIn: "1h",
          }
        );
    });

    it(
      "rejects EMPLOYEE ticket updates with 403",
      async () => {
        const response =
          await request(app)
            .patch(
              "/api/tickets/1"
            )
            .set(
              "Authorization",
              `Bearer ${employeeToken}`
            )
            .send({
              status:
                "Invalid Status",
              assignedToUserId:
                null,
            });

        expect(
          response.status
        ).toBe(403);
      }
    );

    it(
      "allows ADMIN to pass authorization",
      async () => {
        const response =
          await request(app)
            .patch(
              "/api/tickets/1"
            )
            .set(
              "Authorization",
              `Bearer ${adminToken}`
            )
            .send({
              status:
                "Invalid Status",
              assignedToUserId:
                null,
            });

        expect(
          response.status
        ).toBe(400);

        expect(
          response.body.message
        ).toBe(
          "Validation failed"
        );
      }
    );

    it(
      "allows TECHNICIAN to pass authorization",
      async () => {
        const response =
          await request(app)
            .patch(
              "/api/tickets/1"
            )
            .set(
              "Authorization",
              `Bearer ${technicianToken}`
            )
            .send({
              status:
                "Invalid Status",
              assignedToUserId:
                null,
            });

        expect(
          response.status
        ).toBe(400);

        expect(
          response.body.message
        ).toBe(
          "Validation failed"
        );
      }
    );
  }
);