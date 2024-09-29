import request from "supertest";
import app from "../../app";

describe("POST /settings/resend-email-code/", () => {
    it("should not send email code if jwt is not provided", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not send email code if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, invalid token"
        );
    });

    it("should fail to send email code if an invalid jwt is passed", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`)

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to send email code if there is no pending email", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "No pending email to verify");
    });

    it("should fail to send email code if the email is taken", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "An account with this email exists already");
    });

    it("should send email code if the details are valid", async () => {
        const response = await request(app)
            .post("/api/v1/settings/resend-email-code/")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("data");
    });
});
