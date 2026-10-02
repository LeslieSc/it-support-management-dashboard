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
  "Authentication security",
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
    });

    it(
      "rejects authorization header without Bearer",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/tickets"
            )
            .set(
              "Authorization",
              adminToken
            );

        expect(
          response.status
        ).toBe(401);
      }
    );

    it(
      "rejects invalid JWT token",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/tickets"
            )
            .set(
              "Authorization",
              "Bearer invalid-token"
            );

        expect(
          response.status
        ).toBe(401);
      }
    );

    it(
      "rejects expired JWT token",
      async () => {
        const secret =
          process.env.JWT_SECRET;

        if (!secret) {
          throw new Error(
            "JWT_SECRET is required for tests."
          );
        }

        const expiredToken =
          jwt.sign(
            {
              userId: 1,
              email:
                "leslie@example.com",
              role: "ADMIN",
              exp:
                Math.floor(
                  Date.now() /
                    1000
                ) - 60,
            },
            secret
          );

        const response =
          await request(app)
            .get(
              "/api/tickets"
            )
            .set(
              "Authorization",
              `Bearer ${expiredToken}`
            );

        expect(
          response.status
        ).toBe(401);
      }
    );

    it(
      "rejects registration with short password",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/auth/register"
            )
            .send({
              fullName:
                "Test User",
              email:
                "test@example.com",
              password:
                "123",
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
              field:
                "password",
            }),
          ])
        );
      }
    );
  }
);