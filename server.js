const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

app.post("/send-email", async (req, res) => {

    try {

        const {
            gmail,
            appPassword,
            to,
            subject,
            message
        } = req.body;

        const receivers = to
            .split(/[\n,]+/)
            .map(email => email.trim())
            .filter(email => email);

        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: gmail,
                pass: appPassword
            }

        });

        for (const email of receivers) {

            await transporter.sendMail({

                from: gmail,

                to: email,

                subject: subject,

                text: message

            });

        }

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            error: error.message
        });

    }

});

app.listen(process.env.PORT || 3000);
