const User = require('./models/User');
const socketIO = require('./socket.service');
const emailService = require('./email.service');

class NotificationService {
    async notifyMatchingDonors(request) {
        try {
            // Find matching donors
            const matchingDonors = await User.find({
                userType: 'donor',
                bloodGroup: request.bloodGroup,
                isAvailable: true
            });

            // Send notifications through WebSocket
            matchingDonors.forEach(donor => {
                socketIO.emitToUser(donor._id, 'newBloodRequest', {
                    requestId: request._id,
                    bloodGroup: request.bloodGroup,
                    hospital: request.hospital,
                    urgencyLevel: request.urgencyLevel
                });
            });

            // Send email notifications
            matchingDonors.forEach(donor => {
                emailService.sendRequestNotification(donor.email, request);
            });

            return true;
        } catch (error) {
            console.error('Notification error:', error);
            return false;
        }
    }

    async notifyRequester(request) {
        try {
            const donor = await User.findById(request.donorId);
            
            socketIO.emitToUser(request.requesterId, 'requestAccepted', {
                requestId: request._id,
                donorName: donor.fullName,
                donorPhone: donor.phoneNumber
            });

            return true;
        } catch (error) {
            console.error('Requester notification error:', error);
            return false;
        }
    }
}

module.exports = new NotificationService(); 