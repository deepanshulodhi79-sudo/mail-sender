const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/send-email", async (req, res) => {

    const {
        gmail,
        appPassword,
        to,
        subject,
        message
    } = req.body;

    console.log("Request Received");

    try {

        const transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",

            port: 465,

            secure: true,

            auth: {
                user: gmail,
                pass: appPassword
            }

        });

        console.log("Connecting...");

        await transporter.verify();

        console.log("Connected");

        const info = await transporter.sendMail({

            from: gmail,

            to: to,

            subject: subject,

            text: message

        });

        console.log("MAIL SENT");

        res.json({
            success: true,
            info
        });

    } catch (error) {

        console.log("ERROR:");
        console.log(error);

        res.json({
            success: false,
            error: error.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});
