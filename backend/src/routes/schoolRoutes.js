const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const School = require("../models/School");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const priceMap = {
  Starter: 4900,
  Growth: 19900,
  Enterprise: 79900
};

// Register school (creates School + schoolAdmin but inactive)
router.post('/register', schoolController.registerSchool);

// Create Stripe Checkout
router.post("/create-payment-session", async (req, res) => {
    const { schoolId, tier, email } = req.body;

    if (!priceMap[tier]) {
        return res.status(400).json({ message: "Invalid tier selected" });
    }

    try {
        const school = await School.findById(schoolId);
        if (!school) return res.status(400).json({ message: "School not found" });

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: email,
        line_items: [
            {
            price_data: {
                currency: "gbp",
                product_data: { name: `${tier} Plan for ${school.name}` },
                unit_amount: priceMap[tier],
                recurring: { interval: "month" },
            },
            quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/school/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/school/register?canceled=true`,
        metadata: {
            schoolId: school._id.toString(),
            tier,
        },
        });

        res.json({ checkoutUrl: session.url });
    } catch (err) {
        console.error("Stripe session error:", err);
        res.status(500).json({ message: "Could not create payment session" });
    }
});

router.post("/complete-registration", async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ message: "Missing sessionId" });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const { schoolId, tier } = session.metadata;

        const school = await School.findById(schoolId);
        if (!school) return res.status(400).json({ message: "School not found" });

        // activate school + update tier
        school.tier = tier;
        school.status = "active";
        await school.save();

        // find the schoolAdmin user
        const schoolAdmin = await User.findOne({ schoolId: school._id, role: "schoolAdmin" });
        if (!schoolAdmin) {
        return res.status(400).json({ message: "School admin not found" });
        }

        // issue JWT
        const token = jwt.sign(
        { id: schoolAdmin._id, email: schoolAdmin.email, role: schoolAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
        );

        res.json({
        token,
        role: schoolAdmin.role,
        schoolId: school._id,
        message: "Payment complete and school activated!"
        });
    } catch (err) {
        console.error("Complete registration error:", err);
        res.status(500).json({ message: "Failed to complete registration" });
    }
});

router.get('/checkout-session/:id', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.json(session);
    } catch (err) {
        console.error('Error fetching session:', err);
        res.status(500).json({ message: 'Could not fetch session' });
    }
});

module.exports = router;
