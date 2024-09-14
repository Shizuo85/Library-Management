import Mailjet from "node-mailjet";

const { MAILJET_PK, MAILJET_SK, ADMIN_EMAIL, ADMIN_NAME } = process.env;

const mailjet = new Mailjet({
    apiKey: MAILJET_PK,
    apiSecret: MAILJET_SK
});

export default {
    sendMail: (options: any) => {
        return mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: ADMIN_EMAIL,
                        Name: ADMIN_NAME
                    },
                    To: options.receipents,
                    Subject: options.subject,
                    TextPart: options.text || null,
                    HTMLPart: options.html || null,
                    TemplateID: parseInt(options.templateId, 10),
                    TemplateLanguage: options.isTemplate || false,
                    Variables: options.variables || {}
                }
            ]
        });
    },
};