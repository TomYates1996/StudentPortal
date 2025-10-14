require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

(async () => {
    try {
        if (!MONGO_URI) throw new Error('MONGO_URI not set');

        console.log(
            'Connecting to Mongo…',
            process.env.MONGO_URI.replace(/\/\/.*@/, '//<redacted>@')
        );
        console.log('Connecting to Mongo…');
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000, 
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Mongo connection failed:', err.message);
    } finally {
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    }
})();