const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const jsonParser = bodyParser.json();
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_DEV_NAME,
        pass: process.env.GMAIL_DEV_PASSWORD,
    },
});

app.post("/send-email", jsonParser, (req, res) => {
    const { html, email, subject } = req.body;

    transporter.sendMail(
        {
            from: process.env.GMAIL_DEV_NAME, // sender address
            to: email, // list of receivers
            subject, // Subject line
            html,
        },
        (err) => {
            if (err) {
                res.status(500).send(`Could not send to ${email}`);
                console.log(err);
            }
        }
    );
    res.status(200).send(`Email sent successfully`);
});

app.listen(8002, () => {
    console.log("Server is running on port 8002");
});
