const nodemailer = require('nodemailer');

// Create a transporter using @mail.ru SMTP server settings
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',  // SMTP server for @mail.ru
    port: 587,  // Standard port for TLS
    secure: false,  // false for TLS, true for SSL (port 465)
    auth: {
        user: 'almas.kuratov3@mail.ru',  // Replace with your @mail.ru email address
        pass: '17lololowka2006',  // Replace with your password or app-specific password
    },
});

// Send email function
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'almas.kuratov3@mail.ru',  // Replace with your @mail.ru email address
        to,                          // Recipient's email address
        subject,                     // Subject of the email
        text,                        // Body of the email
    };

    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);  // Log any error
        } else {
            console.log('Email sent:', info.response);  // Log success
        }
    });
};

module.exports = sendEmail;