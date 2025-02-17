const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendCertificateEmail(email, certificatePdf) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Blood Donation Certificate',
            html: `
                <h1>Thank you for your blood donation!</h1>
                <p>Please find your donation certificate attached.</p>
            `,
            attachments: [{
                filename: 'donation_certificate.pdf',
                content: certificatePdf
            }]
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendRequestNotification(email, request) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Urgent Blood Request',
            html: `
                <h1>Blood Donation Request</h1>
                <p>A patient needs blood type ${request.bloodGroup} at ${request.hospital}</p>
                <p>Urgency Level: ${request.urgencyLevel}</p>
                <p>Please log in to the platform to accept or decline the request.</p>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService(); 