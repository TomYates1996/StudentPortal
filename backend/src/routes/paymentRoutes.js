const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const School = require("../models/School");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { schoolId, courseId } = session.metadata;

        if (schoolId && courseId) {
            try {
            await School.findByIdAndUpdate(
                schoolId,
                { $addToSet: { courses: courseId } },
                { new: true }
            );
            console.log(`Course ${courseId} added to school ${schoolId}`);
            } catch (err) {
            console.error("Error updating school with course:", err);
            }
        }
        }

        res.json({ received: true });
    }
);

router.get('/session/:id', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.json({ metadata: session.metadata });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch session' });
    }
});

module.exports = router;
