// const { SMTPClient } = require('emailjs');

// const sendEmail = async () => {
//     const client = new SMTPClient({
//         user: 'bc30a861176ee6',
//         password: 'a274715e992af1',
//         port: 465,
//         host: 'sandbox.smtp.mailtrap.io'
//     });

//     try {
//         const message = await client.sendAsync({
//             text: 'i hope this works',
//             from: 'you <username@your-email.com>',
//             to: 'someone <someone@your-email.com>, another <another@your-email.com>',
//             cc: 'else <else@your-email.com>',
//             subject: 'testing emailjs',
//         });
//         console.log(message);
//     } catch (err) {
//         console.error(err);
//     }
// }

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1)Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Snip_Box <snipbox8@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;