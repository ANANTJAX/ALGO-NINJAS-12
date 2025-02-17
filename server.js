require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const http = require("http");
const { Server } = require("socket.io");

const Donor = require("./models/Donor");
const Patient = require("./models/Patient");
const User = require("./models/User"); // Ensure this exists
const Request = require("./models/Request"); // Ensure this exists
const Hospital = require("./models/Hospital"); // Ensure this exists

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// **Middleware**
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// **MongoDB Connection**
const mongoURI = process.env.MONGO_URI || "mongodb://localhost/blood_donation_db";
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.error("MongoDB connection error:", err));

// **Email Configuration**
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// **Authentication Middleware**
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication required" });
    }
};

// **Routes**
app.get("/", (req, res) => res.send("Blood Donation Platform API"));

// **User Registration**
app.post("/api/users/register", async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User({ email, password: hashedPassword, fullName, role });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json(error);
    }
});

// **User Login**
app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ error: "Invalid login credentials" });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json(error);
    }
});

// **Blood Request**
app.post("/api/requests", auth, async (req, res) => {
    try {
        const request = new Request({ ...req.body, requesterId: req.user._id });
        await request.save();

        // **Find Nearby Donors**
        const nearbyDonors = await User.find({
            role: "donor",
            bloodType: request.bloodType,
            isAvailable: true,
            location: {
                $near: { $geometry: request.hospitalLocation, $maxDistance: 10000 } // 10km radius
            }
        });

        // **Send Notifications to Donors**
        nearbyDonors.forEach(async (donor) => {
            io.to(donor._id).emit("newRequest", { message: `Urgent blood request for ${request.bloodType}`, requestId: request._id });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: donor.email,
                subject: "Urgent Blood Request",
                html: `<h1>Urgent Blood Request</h1>
                       <p>Blood type needed: ${request.bloodType}</p>
                       <a href="${process.env.WEBSITE_URL}/donate/${request._id}">Respond Now</a>`
            });
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json(error);
    }
});

// **Admin Statistics**
app.get("/api/admin/statistics", auth, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

    try {
        const stats = {
            totalDonors: await User.countDocuments({ role: "donor" }),
            totalRequests: await Request.countDocuments(),
            pendingRequests: await Request.countDocuments({ status: "pending" }),
            successfulDonations: await Request.countDocuments({ status: "completed" }),
            bloodTypeAvailability: await User.aggregate([
                { $match: { role: "donor", isAvailable: true } },
                { $group: { _id: "$bloodType", count: { $sum: 1 } } }
            ])
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json(error);
    }
});

// **Socket.io Setup**
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => socket.join(userId));

    socket.on("acceptRequest", async ({ requestId, donorId }) => {
        const request = await Request.findById(requestId);
        const donor = await User.findById(donorId);

        request.matchedDonors.push({ donorId, status: "accepted" });
        await request.save();

        io.to(request.requesterId).emit("donorAccepted", {
            message: `${donor.fullName} accepted your request`,
            donorDetails: { name: donor.fullName, phone: donor.phoneNumber }
        });
    });

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// **Start Server**
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

