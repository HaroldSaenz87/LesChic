import sgMail from '@sendgrid/mail';

async function sendEmail({ to, subject, html }) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to,
        from: process.env.MAIL_FROM,
        subject,
        html
    };

    try {
        await sgMail.send(msg)
    } catch (error) {
        throw new Error(error);
    }
}

export default sendEmail;