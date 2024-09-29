import request from "supertest";
import app from "../../app";

describe("POST /settings/new-email", () => {
    it("should not send email code if jwt is not provided", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .send({
                email: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not send email code if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                email: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, invalid token"
        );
    });

    it("should fail to send email code if an invalid jwt is passed", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`)
            .send({
                email: "",
            });

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to send email code if input validation fails", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                email: "invalidemail.com",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to send email code if the email is taken", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                email: "taken@gmail.com",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "An account with this email exists already");
    });

    it("should send email code if the details are valid", async () => {
        const response = await request(app)
            .post("/api/v1/settings/new-email")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                email: "available@gmail.com",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("data");
    });
});
