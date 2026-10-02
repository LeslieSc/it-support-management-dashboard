import request from "supertest";
import {
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

describe(
  "IT Support API",
  () => {
    it(
      "returns API running message",
      async () => {
        const response =
          await request(app)
            .get("/");

        expect(
          response.status
        ).toBe(200);

        expect(
          response.body
        ).toEqual({
          message:
            "IT Support API is running",
        });
      }
    );

    it(
      "returns 404 for unknown routes",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/route-that-does-not-exist"
            );

        expect(
          response.status
        ).toBe(404);

        expect(
          response.body.message
        ).toBe(
          "Route not found"
        );

        expect(
          response.body.path
        ).toBe(
          "/api/route-that-does-not-exist"
        );

        expect(
          response.body.method
        ).toBe("GET");
      }
    );

    it(
      "rejects invalid login email",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/auth/login"
            )
            .send({
              email:
                "invalid-email",
              password:
                "Password123!",
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
              field: "email",
            }),
          ])
        );
      }
    );

    it(
      "rejects login without password",
      async () => {
        const response =
          await request(app)
            .post(
              "/api/auth/login"
            )
            .send({
              email:
                "leslie@example.com",
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
      "rejects protected ticket route without token",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/tickets"
            );

        expect(
          response.status
        ).toBe(401);

        expect(
          response.body
            .message
        ).toBeDefined();
      }
    );

    it(
      "rejects protected dashboard route without token",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/dashboard/stats"
            );

        expect(
          response.status
        ).toBe(401);

        expect(
          response.body
            .message
        ).toBeDefined();
      }
    );

    it(
      "rejects protected technicians route without token",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/users/technicians"
            );

        expect(
          response.status
        ).toBe(401);

        expect(
          response.body
            .message
        ).toBeDefined();
      }
    );
  }
);