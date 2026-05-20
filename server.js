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

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmail,
                pass: appPassword
            }
        });

        await transporter.sendMail({
            from: gmail,
            to: to,
            subject: subject,
            text: message
        });

        res.json({
            success: true,
            message: "Email Sent Successfully"
        });

    } catch (error) {

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
