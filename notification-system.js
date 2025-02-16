class NotificationSystem {
    constructor(userId) {
        this.userId = userId;
        this.socket = io();
        this.initializeSocket();
        this.requestNotificationPermission();
    }

    initializeSocket() {
        this.socket.emit('join', this.userId);
        
        this.socket.on('newRequest', (data) => {
            this.showNotification('Blood Request', data.message);
            this.updateNotificationBadge();
        });

        this.socket.on('donorAccepted', (data) => {
            this.showNotification('Donor Found', data.message);
            this.updateNotificationBadge();
        });
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    showNotification(title, message) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/images/logo.png'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }

    async updateNotificationBadge() {
        try {
            const response = await fetch(`/api/notifications/unread/${this.userId}`);
            const { count } = await response.json();
            
            const badge = document.getElementById('notification-badge');
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        } catch (error) {
            console.error('Error updating notification badge:', error);
        }
    }
}

class BloodDonationNotificationSystem {
    constructor() {
        this.socket = io();
        this.initializeSocketListeners();
        this.requestNotificationPermission();
    }

    initializeSocketListeners() {
        this.socket.on('bloodRequest', (data) => {
            if (this.isMatchingDonor(data.bloodGroup)) {
                this.showBloodRequestNotification(data);
            }
        });

        this.socket.on('donationApproved', (data) => {
            this.showDonationApprovedNotification(data);
            this.generateAndSendCertificate(data);
        });
    }

    showBloodRequestNotification(requestData) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-primary animate-slideIn max-w-md';
        notification.innerHTML = `
            <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                    <i class="fas fa-heartbeat text-2xl text-primary"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold">Urgent Blood Required</h4>
                    <p class="text-sm text-gray-600 mb-2">
                        Blood Group ${requestData.bloodGroup} needed at ${requestData.hospital}
                    </p>
                    <div class="flex space-x-2">
                        <button onclick="acceptRequest('${requestData.id}')" 
                            class="px-3 py-1 bg-primary text-white rounded-lg text-sm">
                            Accept
                        </button>
                        <button onclick="declineRequest('${requestData.id}')"
                            class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
    }

    generateAndSendCertificate(donationData) {
        const certificateData = {
            donorName: donationData.donorName,
            bloodGroup: donationData.bloodGroup,
            donationDate: new Date().toLocaleDateString(),
            hospital: donationData.hospital,
            certificateId: `DON-${Date.now()}`
        };

        // Generate PDF certificate
        const pdf = this.generatePDFCertificate(certificateData);
        
        // Send email with certificate
        this.sendEmailWithCertificate(donationData.email, pdf);
    }
} 