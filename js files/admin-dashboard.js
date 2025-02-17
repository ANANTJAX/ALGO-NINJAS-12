class AdminDashboard {
    constructor() {
        this.initializeCharts();
        this.loadStatistics();
        this.setupRealTimeUpdates();
    }

    async loadStatistics() {
        try {
            const response = await fetch('/api/admin/statistics', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const stats = await response.json();
            this.updateDashboard(stats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    updateDashboard(stats) {
        // Update charts and statistics
        this.updateDonorChart(stats.bloodTypeAvailability);
        this.updateRequestsChart(stats);
        
        // Update counters
        document.getElementById('totalDonors').textContent = stats.totalDonors;
        document.getElementById('pendingRequests').textContent = stats.pendingRequests;
        document.getElementById('successfulDonations').textContent = stats.successfulDonations;
    }

    setupRealTimeUpdates() {
        const socket = io();
        
        socket.on('newRequest', (data) => {
            this.showNotification('New Blood Request', data.message);
            this.loadStatistics(); // Refresh statistics
        });

        socket.on('donationCompleted', (data) => {
            this.showNotification('Donation Completed', data.message);
            this.loadStatistics();
        });
    }

    showNotification(title, message) {
        const notification = new Notification(title, {
            body: message,
            icon: '/images/logo.png'
        });
    }
} 