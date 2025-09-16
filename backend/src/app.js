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

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use("/api/payments", paymentRoutes);
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/access-requests', accessRequestRoutes);
app.use("/api/classes", classRoutes);

app.get('/', (req, res) => {
    res.send('Student Portal API is running');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
});

module.exports = app;
