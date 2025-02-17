const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

class AuthService {
    async register(userData) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Create user
            const user = new User({
                fullName: userData.fullName,
                email: userData.email,
                password: hashedPassword,
                userType: userData.userType,
                bloodGroup: userData.bloodGroup,
                phoneNumber: userData.phoneNumber,
                preferredHospital: userData.preferredHospital
            });

            await user.save();
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, userType: user.userType },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return { user, token };
        } catch (error) {
            throw new Error('Registration failed: ' + error.message);
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign(
                { userId: user._id, userType: user.userType },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return { user, token };
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }
}

module.exports = new AuthService(); 