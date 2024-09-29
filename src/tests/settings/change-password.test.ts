import request from "supertest";
import app from "../../app";

describe("PATCH /settings/change-password", () => {
    it("should not update password if jwt is not provided", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .send({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not update password if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, invalid token"
        );
    });

    it("should fail to update password if an invalid jwt is passed", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`)
            .send({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update password if input validation fails", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                oldPassword: 1234,
                newPassword: [""],
                confirmPassword: true,
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fail to update password if the old password is incorrect", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                oldPassword: "wrong password",
                newPassword: "newP_ass1",
                confirmPassword: "newP_ass1",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "Current Password is Incorrect");
    });

    it("should fail to update password if the passwords do not match", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                oldPassword: "right password",
                newPassword: "newP_ass1",
                confirmPassword: "new_Pass1",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "Password mismatch");
    });

    it("should fail to update password if new password matches old password", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                oldPassword: "right password",
                newPassword: "right password",
                confirmPassword: "right password",
            });

        expect([422, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error", "New password must differ from the old one.");
    });

    it("should update password if the details are valid", async () => {
        const response = await request(app)
            .patch("/api/v1/settings/change-password")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send({
                oldPassword: "right password",
                newPassword: "newP_ass1",
                confirmPassword: "newP_ass1",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});
