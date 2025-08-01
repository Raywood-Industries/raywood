const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');

console.log('MongoDB URI:', process.env.MONGO_URI);

const app = express();

// Serve React frontend build folder
const frontendPath = path.join(__dirname, '../frontend', 'build');
app.use(express.static(frontendPath));

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration - change origin to your React app's URL and port
app.use(cors({
  origin: 'https://raywoodind.onrender.com', // <-- Change this if your frontend runs on a different port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Database Name:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Test endpoint to verify server and CORS are working
app.get('/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Contact form endpoint
app.post('/api/inquiry', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const businessMailOptions = {
      from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Inquiry from Raywood Industries Website",
      text: `New Inquiry Received:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const userMailOptions = {
      from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Us',
      text: `Dear ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nHere is a copy of your message:\n${message}\n\nBest regards,\nRaywood Industries Team`,
    };

    await transporter.sendMail(businessMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).send({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send({ message: 'There was an error sending your message. Please try again later.' });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(200).send({ message: 'Already subscribed' });
}

  try {
    console.log('Received newsletter request:', { email });

    const newUser = new User({ email });
    await newUser.save();
    console.log('User saved to MongoDB:', newUser);

    const userMailOptions = {
      from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Newsletter Confirmation',
      text: `Dear subscriber,\n\nThank you for subscribing to our newsletter! We will keep you updated with the latest news and offers.\n\nBest regards,\nRaywood Industries Team`,
    };

    const businessMailOptions = {
      from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      text: `New Subscription Received:\n\nEmail: ${email}`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(businessMailOptions);

    res.status(200).send({ message: 'Newsletter Request Successful' });
  } catch (error) {
    console.error('Error submitting newsletter request:', error);
    res.status(500).send({ message: 'Error submitting newsletter request' });
  }
});

// Get newsletter/users for unsubscribe page
app.get('/api/unsubscribe', async (req, res) => {
  const { date } = req.query;
  try {
    const query = {};
    if (date) query.date = date;

    console.log('Query sent to MongoDB:', query);
    const users = await User.find(query);
    console.log('Fetched users from MongoDB:', users);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Failed to fetch users' });
  }
});

// Delete/unsubscribe newsletter users
app.delete('/api/unsubscribe', async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users)) {
    return res.status(400).send({ message: 'Invalid request format: users must be an array' });
  }

  try {
    const emails = users.map(a => a.email).filter(Boolean);
    const result = await User.deleteMany({ email: { $in: emails } });
    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(200).send({ message: 'Already unsubscribed' });
    }

    // Send emails concurrently
    await Promise.all(users.map(async (users) => {
      const { email } = users;

      const userMailOptions = {
        from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Unsubscribe Confirmation',
        text: `Dear subscriber,\n\nYou have successfully unsubscribed from our newsletter.\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\nRaywood Industries Team`,
      };

      const businessMailOptions = {
        from: `"Raywood Industries" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'Someone Unsubscribed from the Newsletter',
        text: `Unsubscription Received:\n\nEmail: ${email}`,
      };

      try {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(businessMailOptions);
        console.log(`Cancellation emails sent for user ID: ${users.email}`);
      } catch (emailError) {
        console.error(`Error sending unsubscribe emails for user ID: ${users._id}`, emailError);
      }
    }));

    res.status(200).send({ message: 'Successfully unsubscribed user(s)' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).send({ message: 'Failed to delete user(s)' });
  }
});

// Fallback to serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Listen on port 5001 (or from env)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
