import request from "supertest";
import app from "../../app";

describe("PATCH /settings/verify-email", () => {
    it("should not update email if jwt is not provided", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .send({
                otp: "133761",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not update email if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                otp: "133761",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, invalid token"
        );
    });

    it("should fail to update email if an invalid jwt is passed", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`)
            .send({
                otp: "133761",
            });

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update email if input validation fails", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                otp: [],
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update email if otp is wrong or expired", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                otp: "133762",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty(
            "error",
            "Invalid or expired code"
        );
    });

    it("should fail to update email if the email is taken", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                otp: "133762",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "An account with this email exists already");
    });

    it("should update email if the details are valid", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/verify-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                otp: "133761",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});
