const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const accessRequestRoutes = require('./routes/accessRequestRoutes');
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const allowedOrigins = [
    process.env.ALLOWED_ORIGIN,    
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        const ok = allowedOrigins.includes(origin);
        if (!ok) console.warn('CORS blocked for origin:', origin, 'Allowed:', allowedOrigins);
        return cb(null, ok);
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Stripe-Signature','x-auth-token'],
}));
// app.options('*', cors());

app.use(morgan('dev'));
app.use('/api/payments', paymentRoutes);

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/db/status', (req, res) => {
    const s = mongoose.connection.readyState; 
    res.json({ readyState: s });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/access-requests', accessRequestRoutes);
app.use('/api/classes', classRoutes);

app.get('/', (req, res) => res.send('Student Portal API is running'));

app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message, stack: err.stack });
});

module.exports = app;
