const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/send-email", async (req, res) => {
    try {
        const { gmail, appPassword, to, subject, message, senderName } = req.body;

        const receivers = to
            .split(/[\n,]+/)
            .map((email) => email.trim())
            .filter((email) => email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: gmail,
                pass: appPassword,
            },
            pool: true,          // reuse connections
            maxConnections: 1,   // avoid parallel sending (looks spammy)
            rateDelta: 1000,     // 1 second between sends
            rateLimit: 1,
        });

        for (const email of receivers) {
            await transporter.sendMail({
                from: `"${senderName || "Your Name"}" <${gmail}>`,  // display name matters
                to: email,
                replyTo: gmail,
                subject: subject,

                // Always send BOTH text and HTML
                text: message,
                html: `<div style="font-family: Arial, sans-serif; font-size: 15px; color: #222;">
                            ${message.replace(/\n/g, "<br/>")}
                       </div>`,

                headers: {
                    // Tells providers this isn't automated bulk spam
                    "X-Mailer": "Nodemailer",
                    "List-Unsubscribe": `<mailto:${gmail}?subject=unsubscribe>`,
                    "Precedence": "bulk",
                },
            });

            // Delay between each email — critical to avoid spam flagging
            await sleep(1500);
        }

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
});

app.listen(process.env.PORT || 3000);
