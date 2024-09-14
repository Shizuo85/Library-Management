import mailjetService from "./mailjet.service";

export async function sendMail(to: any, subject: any, templateId: any, variables: any, mailType: any){
    try {
        await mailjetService.sendMail({
            receipents: [{
                Email: to.email,
                Name: to.name
            }],
            subject,
            isTemplate: (templateId !== undefined && templateId !== null && templateId !== ""),
            templateId,
            variables
        });
        console.log("%s Email sent to dest: %s", mailType, to.email);
    } catch (mailError) {
        console.error("Error sending mail, %o", mailError);
        throw new Error("Error sending mail");
    }
}