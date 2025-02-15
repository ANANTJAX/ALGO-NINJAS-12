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