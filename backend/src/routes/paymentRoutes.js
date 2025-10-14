const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const School = require("../models/School");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.get('/ping', (req,res) => res.json({ ok: true }));

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        console.log('[WEBHOOK] HIT', new Date().toISOString());  
        res.set('x-webhook', 'hit');
        const sig = req.headers["stripe-signature"];

        let event;
        try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
        console.error("[WEBHOOK] verify failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("[WEBHOOK] delivered:", event.id, event.type); 

        if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { schoolId, courseId } = session.metadata || {};
        console.log("[WEBHOOK] session:", session.id, "metadata:", { schoolId, courseId }); 

        if (schoolId && courseId) {
            try {
                const result = await School.findByIdAndUpdate(
                    schoolId,
                    { $addToSet: { courses: courseId } },
                    { new: true }
                );
                console.log(`[WEBHOOK] Course ${courseId} added to school ${schoolId}; updated:`, !!result); // <---
            } catch (err) {
                console.error("[WEBHOOK] DB update error:", err); 
            }
        } else {
            console.warn("[WEBHOOK] missing schoolId/courseId in metadata"); 
        }
        } else {
            console.log("[WEBHOOK] ignored event type:", event.type); 
        }

        return res.status(200).send("[ok]"); 
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
