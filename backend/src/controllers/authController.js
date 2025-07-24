const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const twilio = require('twilio'); // Uncomment and configure for real use

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, location, userType } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      location,
      userType,
      badges: ['Newbie'], // Assign default badge
    });
    await user.save();
    // Send WhatsApp confirmation (mock)
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   from: process.env.TWILIO_WHATSAPP_NUMBER,
    //   to: `whatsapp:${phone}`,
    //   body: 'Welcome to TurfBook! Your registration is successful.'
    // });
    res.status(201).json({ message: 'Signup successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, userType: user.userType, badges: user.badges } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 