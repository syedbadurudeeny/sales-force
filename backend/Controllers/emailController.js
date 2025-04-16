const nodemailer = require('nodemailer');
const EmailModel = require('../Models/emailModel');

async function Email(req, res) {
    const { to, subject, message } = req.body;

    console.log("emailData : ",to, subject, message)


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.from,
            pass: process.env.pass
        }
    });


    const mailOptions = {
        from: process.env.from,
        to: to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            const sentEmail = await EmailModel.create({to,subject,message});
            sentEmail.save();
            console.log('Email sent: ' + info.response);
        }
    });
  
}

module.exports = Email;