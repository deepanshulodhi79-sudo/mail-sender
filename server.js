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

        console.log("TOTAL RECEIVERS:");
        console.log(receivers);

        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: gmail,
                pass: appPassword
            }

        });

        console.log("VERIFYING LOGIN");

        await transporter.verify();

        console.log("LOGIN SUCCESS");

        const info = await transporter.sendMail({

            from: gmail,

            to: receivers,

            subject: subject,

            html: `

                <div style="font-family:Arial;padding:20px">

                    <h2>${subject}</h2>

                    <p style="font-size:16px">
                        ${message}
                    </p>

                </div>

            `

        });

        console.log("MAIL SENT");
        console.log(info);

        res.json({

            success: true,

            message:
                "Emails Sent Successfully"

        });

    } catch (error) {

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
