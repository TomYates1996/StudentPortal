const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const School = require("../models/School");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');

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

// Create Stripe Checkout for Course Purchase
router.post("/purchase-course", async (req, res) => {
    const { schoolId, title, courseId, userEmail } = req.body;

    // VERIFY THE COURSE ID WHEN YOU GET INTERNET AGAIN AND SORT IT PROPERLY
    // if (!courses[courseId]) {
    //     return res.status(400).json({ message: "Invalid tier selected" });
    // }

    try {
        const school = await School.findById(schoolId);
        if (!school) return res.status(400).json({ message: "School not found" });

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: userEmail,
        line_items: [
            {
            price_data: {
                currency: "gbp",
                product_data: { name: `${title} for ${school.name}` },
                // Set this unit amout from the course data - search the db for the id and grab it
                unit_amount: 50000,
            },
            quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/school/course-purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/school/browse-courses?canceled=true`,
        metadata: {
            schoolId: school._id.toString(),
            title,
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

// Get the school name
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json(school);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add an educator
router.post('/:schoolId/add-educator', authMiddleware, schoolController.addEducator);

// Get the educators
router.get('/:schoolId/educators', authMiddleware, schoolController.getEducators);

module.exports = router;
