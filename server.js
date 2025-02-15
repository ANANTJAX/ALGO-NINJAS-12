const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const socket = require('socket.io');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost/blood_donation_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Enhanced User Schema with Authentication
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['donor', 'recipient', 'admin'], default: 'donor' },
    bloodType: String,
    phoneNumber: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
    },
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: Date,
    notifications: [{
        message: String,
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }]
});

// Enhanced Request Schema
const requestSchema = new mongoose.Schema({
    patientName: String,
    contactEmail: String,
    bloodType: String,
    units: Number,
    urgency: { type: String, enum: ['normal', 'urgent', 'emergency'] },
    hospitalLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    status: { type: String, default: 'pending' },
    matchedDonors: [{
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'] }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

// Routes

// User Authentication
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({
            email,
            password: hashedPassword,
            fullName,
            role
        });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid login credentials');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid login credentials');
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Blood Request with Real-time Notifications
app.post('/api/requests', auth, async (req, res) => {
    try {
        const request = new Request({
            ...req.body,
            userId: req.user._id
        });
        await request.save();

        // Find nearby donors
        const nearbyDonors = await User.find({
            role: 'donor',
            bloodType: request.bloodType,
            isAvailable: true,
            location: {
                $near: {
                    $geometry: request.hospitalLocation,
                    $maxDistance: 10000 // 10km radius
                }
            }
        });

        // Send notifications to nearby donors
        nearbyDonors.forEach(async (donor) => {
            // Socket notification
            io.to(donor._id).emit('newRequest', {
                message: `Urgent blood request for ${request.bloodType}`,
                requestId: request._id
            });

            // Email notification
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: donor.email,
                subject: 'Urgent Blood Request',
                html: `<h1>Urgent Blood Request</h1>
                       <p>Blood type needed: ${request.bloodType}</p>
                       <p>Hospital: ${request.hospitalLocation}</p>
                       <a href="${process.env.WEBSITE_URL}/donate/${request._id}">Respond to Request</a>`
            };
            await transporter.sendMail(mailOptions);
        });

        res.status(201).send(request);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Admin Dashboard Routes
app.get('/api/admin/statistics', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send({ error: 'Not authorized' });
    
    try {
        const stats = {
            totalDonors: await User.countDocuments({ role: 'donor' }),
            totalRequests: await Request.countDocuments(),
            pendingRequests: await Request.countDocuments({ status: 'pending' }),
            successfulDonations: await Request.countDocuments({ status: 'completed' }),
            bloodTypeAvailability: await User.aggregate([
                { $match: { role: 'donor', isAvailable: true } },
                { $group: { _id: '$bloodType', count: { $sum: 1 } } }
            ])
        };
        res.send(stats);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Socket.io setup
const server = app.listen(PORT);
const io = socket(server);

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('acceptRequest', async ({ requestId, donorId }) => {
        const request = await Request.findById(requestId);
        const donor = await User.findById(donorId);
        
        // Update request status
        request.matchedDonors.push({ donorId, status: 'accepted' });
        await request.save();

        // Notify recipient
        io.to(request.userId).emit('donorAccepted', {
            message: `${donor.fullName} has accepted your request`,
            donorDetails: {
                name: donor.fullName,
                phone: donor.phoneNumber
            }
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 