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
  "Ticket validation",
  () => {
    let adminToken: string;

    beforeAll(() => {
      const secret =
        process.env.JWT_SECRET;

      if (!secret) {
        throw new Error(
          "JWT_SECRET is required for tests."
        );
      }

      adminToken =
        jwt.sign(
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
    });

    it(
      "rejects ticket with short title",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/tickets"
            )
            .set(
              "Authorization",
              `Bearer ${adminToken}`
            )
            .send({
              title: "A",
              description:
                "Valid description",
              branch:
                "Chihuahua 001",
              category:
                "Network",
              priority:
                "High",
            });

        expect(
          response.status
        ).toBe(400);

        expect(
          response.body.message
        ).toBe(
          "Validation failed"
        );

        expect(
          response.body.errors
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: "title",
            }),
          ])
        );
      }
    );

    it(
      "rejects invalid ticket category",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/tickets"
            )
            .set(
              "Authorization",
              `Bearer ${adminToken}`
            )
            .send({
              title:
                "Network issue",
              description:
                "Computer cannot connect to network",
              branch:
                "Chihuahua 001",
              category:
                "Invalid Category",
              priority:
                "High",
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
      "rejects invalid ticket priority",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/tickets"
            )
            .set(
              "Authorization",
              `Bearer ${adminToken}`
            )
            .send({
              title:
                "Network issue",
              description:
                "Computer cannot connect to network",
              branch:
                "Chihuahua 001",
              category:
                "Network",
              priority:
                "Urgent",
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
      "rejects invalid ticket status",
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
                "Finished",
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
      "rejects invalid technician ID",
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
                "In Progress",
              assignedToUserId:
                -5,
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