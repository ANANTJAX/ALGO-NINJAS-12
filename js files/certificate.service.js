const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const emailService = require('./email.service');

class CertificateService {
    async generateCertificate(donationData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Add certificate styling and content
        this.addCertificateBackground(doc);
        this.addCertificateHeader(doc);
        this.addCertificateContent(doc, donationData);
        this.addCertificateFooter(doc, donationData);

        return doc;
    }

    addCertificateBackground(doc) {
        // Add decorative border
        doc.setDrawColor(231, 76, 60); // Primary red color
        doc.setLineWidth(1);
        doc.roundedRect(10, 10, 277, 190, 3, 3);
        
        // Add inner border
        doc.setDrawColor(231, 76, 60, 0.5);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, 15, 267, 180, 3, 3);

        // Add watermark
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(130);
        doc.text('LifeLink', 148.5, 100, { align: 'center', angle: 45 });
    }

    addCertificateHeader(doc) {
        // Add logo
        doc.addImage('path/to/logo.png', 'PNG', 20, 20, 30, 30);

        // Add title
        doc.setTextColor(231, 76, 60);
        doc.setFontSize(40);
        doc.text('Certificate of Appreciation', 148.5, 40, { align: 'center' });
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(16);
        doc.text('For Blood Donation', 148.5, 50, { align: 'center' });
    }

    addCertificateContent(doc, data) {
        // Main content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text('This certificate is proudly presented to', 148.5, 70, { align: 'center' });

        // Donor name
        doc.setFontSize(24);
        doc.setTextColor(231, 76, 60);
        doc.text(data.donorName.toUpperCase(), 148.5, 85, { align: 'center' });

        // Donation details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text([
            'for their noble contribution in donating blood and saving lives.',
            `Blood Group: ${data.bloodGroup}`,
            `Donation Date: ${data.donationDate}`,
            `Hospital: ${data.hospital}`,
            `Certificate ID: ${data.certificateId}`
        ], 148.5, 100, { align: 'center', lineHeightFactor: 1.5 });
    }

    addCertificateFooter(doc, data) {
        // Add signatures
        doc.addImage('path/to/signature1.png', 'PNG', 50, 160, 40, 20);
        doc.addImage('path/to/signature2.png', 'PNG', 200, 160, 40, 20);

        // Add signature labels
        doc.setFontSize(12);
        doc.text('Medical Officer', 70, 185, { align: 'center' });
        doc.text('Hospital Director', 220, 185, { align: 'center' });

        // Add QR code for verification
        const qrData = `https://lifelink.com/verify/${data.certificateId}`;
        doc.addImage(this.generateQRCode(qrData), 'PNG', 125, 150, 30, 30);
    }

    async sendCertificateEmail(donationData) {
        try {
            const doc = await this.generateCertificate(donationData);
            const pdfBytes = await doc.output('arraybuffer');

            const emailData = {
                to: donationData.email,
                subject: 'Thank You for Your Blood Donation',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #e74c3c; text-align: center;">Thank You for Your Noble Deed!</h1>
                        <p>Dear ${donationData.donorName},</p>
                        <p>Thank you for your generous blood donation. Your contribution will help save lives.</p>
                        <p>Please find attached your Certificate of Appreciation.</p>
                        <p>You will be eligible to donate again after 3 months.</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <p style="color: #666;">Next Eligible Donation Date:</p>
                            <p style="font-size: 18px; color: #e74c3c;">${this.getNextDonationDate(donationData.donationDate)}</p>
                        </div>
                        <p>Best regards,<br>LifeLink Team</p>
                    </div>
                `,
                attachments: [{
                    filename: `blood_donation_certificate_${donationData.certificateId}.pdf`,
                    content: pdfBytes
                }]
            };

            await this.sendEmail(emailData);
            return true;
        } catch (error) {
            console.error('Error sending certificate:', error);
            return false;
        }
    }

    getNextDonationDate(donationDate) {
        const nextDate = new Date(donationDate);
        nextDate.setMonth(nextDate.getMonth() + 3);
        return nextDate.toLocaleDateString();
    }

    generateQRCode(data) {
        // Implement QR code generation
        // You can use libraries like qrcode-generator
        return qrCodeImage;
    }
}

module.exports = new CertificateService(); 