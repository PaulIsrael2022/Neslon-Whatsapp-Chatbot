import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMail(mailOptions) {
        try {
            // Email service is disabled for now
            console.log('Email service is disabled. Would have sent email:', {
                to: mailOptions.to,
                subject: mailOptions.subject
            });
            return;
            
            // When ready to enable, uncomment the following:
            // const info = await this.transporter.sendMail(mailOptions);
            // return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Email service connection failed:', error);
            return false;
        }
    }
}

export default new EmailService();
