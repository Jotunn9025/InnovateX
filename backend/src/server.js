require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store mapping of owner email/userId to socket id
const ownerSocketMap = new Map();
const userSocketMap = new Map();

io.on('connection', (socket) => {
  // Client should emit 'register' with { userId, userType, email } after connecting
  socket.on('register', ({ userId, userType, email }) => {
    if (userType === 'admin') {
      ownerSocketMap.set(email, socket.id);
    } else {
      userSocketMap.set(userId, socket.id);
    }
    socket.data = { userId, userType, email };
  });

  socket.on('disconnect', () => {
    if (socket.data?.userType === 'admin') {
      ownerSocketMap.delete(socket.data.email);
    } else if (socket.data?.userId) {
      userSocketMap.delete(socket.data.userId);
    }
  });

  // Owner approves a booking
  socket.on('approve-booking', async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return;
      booking.status = 'approved';
      await booking.save();
      // Send WhatsApp message to user (booking approved)
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const dummyQR = 'QR123456789'; // Dummy QR code string
        await client.messages.create({
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+919082331229',
          body: `Hi, your booking for ${booking.turf} on ${booking.date.toISOString().slice(0,10)} at ${booking.timeSlot} has been approved!\nYour QR code: ${dummyQR}`
        });
      } catch (twilioErr) {
        console.error('Twilio error on approval:', twilioErr);
      }
      // Send QR code image to email
      try {
        const qrData = `${booking._id}|${booking.user}|${booking.turf}|${booking.sport}|${booking.date}|${booking.timeSlot}`;
        const qrImage = await QRCode.toDataURL(qrData);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: 'arry.bhagat@gmail.com',
          subject: 'Your Booking QR Code',
          text: `Your booking for ${booking.turf} on ${booking.date.toISOString().slice(0,10)} at ${booking.timeSlot} has been approved! Please find your QR code attached.`,
          attachments: [
            {
              filename: 'qrcode.png',
              content: qrImage.split("base64,")[1],
              encoding: 'base64',
            },
          ],
        });
      } catch (emailErr) {
        console.error('Email error on approval:', emailErr);
      }
      // Notify user in real-time
      const userSocketMap = app.get('userSocketMap');
      if (userSocketMap.has(booking.user.toString())) {
        io.to(userSocketMap.get(booking.user.toString())).emit('booking-status', {
          bookingId,
          status: 'approved',
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  });

  // Owner rejects a booking
  socket.on('reject-booking', async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return;
      booking.status = 'rejected';
      await booking.save();
      // Notify user in real-time
      const userSocketMap = app.get('userSocketMap');
      if (userSocketMap.has(booking.user.toString())) {
        io.to(userSocketMap.get(booking.user.toString())).emit('booking-status', {
          bookingId,
          status: 'rejected',
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  });
});

app.set('io', io);
app.set('ownerSocketMap', ownerSocketMap);
app.set('userSocketMap', userSocketMap);

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
const Booking = require('./models/Booking');

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
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 