const Request = require('./models/Request');
const NotificationService = require('./notification.service');

class RequestService {
    async createRequest(requestData) {
        try {
            const request = new Request({
                requesterId: requestData.userId,
                bloodGroup: requestData.bloodGroup,
                urgencyLevel: requestData.urgencyLevel,
                hospital: requestData.hospital,
                patientName: requestData.patientName,
                additionalNotes: requestData.additionalNotes,
                status: 'pending'
            });

            await request.save();

            // Notify matching donors
            await NotificationService.notifyMatchingDonors(request);

            return request;
        } catch (error) {
            throw new Error('Failed to create request: ' + error.message);
        }
    }

    async updateRequestStatus(requestId, status, donorId) {
        try {
            const request = await Request.findByIdAndUpdate(
                requestId,
                { 
                    status,
                    donorId: status === 'accepted' ? donorId : null,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (status === 'accepted') {
                await NotificationService.notifyRequester(request);
            }

            return request;
        } catch (error) {
            throw new Error('Failed to update request status: ' + error.message);
        }
    }
}

module.exports = new RequestService(); 