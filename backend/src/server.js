require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const tournamentRoutes = require('./routes/tournament');
const userRoutes = require('./routes/user');
const demandRoutes = require('./routes/demand');
const communityRoutes = require('./routes/community');
const badgeRoutes = require('./routes/badge');
const turfRoutes = require('./routes/turf');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/turfs', turfRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 