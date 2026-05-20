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

    console.log("EMAIL REQUEST RECEIVED");

    try{

        const {
            gmail,
            appPassword,
            to,
            subject,
            message
        } = req.body;

        console.log("CREATING TRANSPORTER");

        const transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",

            port: 465,

            secure: true,

            auth: {
                user: gmail,
                pass: appPassword
            }

        });

        console.log("VERIFYING CONNECTION");

        await transporter.verify();

        console.log("CONNECTION SUCCESS");

        const info = await transporter.sendMail({

            from: gmail,

            to: to,

            subject: subject,

            text: message

        });

        console.log("EMAIL SENT");
        console.log(info);

        res.json({

            success: true,

            message: "Email Sent"

        });

    }catch(error){

        console.log("FULL ERROR:");
        console.log(error);

        res.json({

            success: false,

            error: error.message

        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("SERVER RUNNING");

});
