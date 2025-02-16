document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    
    // Form elements
    const donorForm = document.getElementById('donorForm');
    const requestForm = document.getElementById('requestForm');
    const donateBtn = document.getElementById('donateBtn');
    const requestBtn = document.getElementById('requestBtn');

    // Add this to your existing JavaScript
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const modalContent = document.getElementById('modalContent');
    const emergencyBtn = document.getElementById('emergencyBtn');

    const loginText = document.querySelector('.login-text');

    // Login Modal functionality
    loginBtn.onclick = function() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            // Handle logout
            const confirmation = confirm('Are you sure you want to logout?');
            if (confirmation) {
                loginText.textContent = 'Login';
                loginBtn.classList.remove('bg-gray-600');
                loginBtn.classList.add('bg-primary');
                localStorage.removeItem('isLoggedIn');
                return;
            }
        } else {
            // Show login modal
            modal.style.display = "flex";
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    }

    closeBtn.onclick = function() {
        // Add exit animation
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.style.display = "none";
        }, 200);
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            closeBtn.click();
        }
    }

    // Enhanced login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Simple validation
        if (email && password) {
            // Add success animation
            const button = loginBtn.querySelector('.login-text');
            button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                // Show success message
                alert('Login successful!');
                modal.style.display = "none";
                loginText.textContent = 'Logout';
                loginBtn.classList.remove('bg-primary');
                loginBtn.classList.add('bg-gray-600');
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                // Reset form
                loginForm.reset();
                button.textContent = 'Logout';
            }, 1000);
        }
    });

    // Check login state on page load
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginText.textContent = 'Logout';
        loginBtn.classList.remove('bg-primary');
        loginBtn.classList.add('bg-gray-600');
    }

    // Handle donor form submission
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Use Geolocation API to get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const donorData = {
                    fullName: donorForm.querySelector('input[placeholder="Full Name"]').value,
                    bloodType: donorForm.querySelector('select[name="bloodGroup"]').value,
                    phoneNumber: donorForm.querySelector('input[placeholder="Phone Number"]').value,
                    email: donorForm.querySelector('input[placeholder="Email"]').value,
                    locationLat: position.coords.latitude,
                    locationLng: position.coords.longitude,
                    isAvailable: true, // Default to available
                    registrationDate: new Date().toLocaleDateString(),
                    registrationId: 'BD' + Date.now().toString().slice(-6)
                };

                // Store donor data in local storage
                localStorage.setItem('donorData', JSON.stringify(donorData));

                // Initialize map with donor location
                initMap();

                // Check for matching patient
                checkForMatch(donorData);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Handle request form submission
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Capture patient data
        const patientData = {
            patientName: requestForm.querySelector('input[placeholder="Patient Name"]').value,
            bloodType: requestForm.querySelector('select[name="bloodType"]').value,
            hospital: requestForm.querySelector('input[placeholder="Hospital Location"]').value
        };

        // Store patient data in local storage
        localStorage.setItem('patientData', JSON.stringify(patientData));

        // Check for matching donor
        checkForMatch(null, patientData);
    });

    // Function to check for matches
    function checkForMatch(donorData = null, patientData = null) {
        if (!donorData) {
            donorData = JSON.parse(localStorage.getItem('donorData'));
        }
        if (!patientData) {
            patientData = JSON.parse(localStorage.getItem('patientData'));
        }

        if (donorData && patientData && donorData.bloodType === patientData.bloodType) {
            // Display notification popup
            showNotificationPopup(donorData, patientData);
        }
    }

    // Function to display notification popup
    function showNotificationPopup(donorData, patientData) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification-popup bg-white p-4 rounded-lg shadow-lg fixed bottom-4 right-4';
        notificationDiv.innerHTML = `
            <h4 class="font-bold text-primary">Match Found!</h4>
            <p>Donor: ${donorData.fullName} (${donorData.bloodType})</p>
            <p>Patient: ${patientData.patientName} (${patientData.bloodType})</p>
            <p>Hospital: ${patientData.hospital}</p>
            <button class="mt-2 bg-primary text-white py-1 px-3 rounded" onclick="startChat()">Connect</button>
        `;
        document.body.appendChild(notificationDiv);

        // Auto-remove notification after 10 seconds
        setTimeout(() => {
            notificationDiv.remove();
        }, 10000);
    }

    // Function to start chat (placeholder)
    function startChat() {
        alert('Chat feature coming soon!');
    }

    // Homepage buttons functionality
    donateBtn.addEventListener('click', function() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Please login first to donate blood.');
            modal.style.display = "block";
            return;
        }
        document.querySelector('#donate').scrollIntoView({ behavior: 'smooth' });
    });

    requestBtn.addEventListener('click', function() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Please login first to request blood.');
            modal.style.display = "block";
            return;
        }
        document.querySelector('#request').scrollIntoView({ behavior: 'smooth' });
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        
        // Change icon based on menu state
        mobileMenuBtn.innerHTML = isHidden 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Emergency button functionality
    emergencyBtn.addEventListener('click', function() {
        const confirmation = confirm('This will connect you to emergency services. Continue?');
        if (confirmation) {
            alert('Connecting to nearest blood bank...');
            // Add your emergency contact logic here
        }
    });

    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            mobileMenu.classList.add('hidden'); // Close mobile menu if open
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // News ticker interaction
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the news text
            const newsText = this.querySelector('span').textContent;
            
            // Create and show a modal or notification with the full news
            const newsModal = document.createElement('div');
            newsModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            newsModal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-lg mx-4 transform transition-all animate-fadeIn">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-primary">Blood Donation News</h3>
                        <button class="text-gray-500 hover:text-primary">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="text-gray-700">${newsText}</p>
                    <div class="mt-4 text-sm text-gray-500">
                        Published: ${new Date().toLocaleDateString()}
                    </div>
                </div>
            `;
            
            document.body.appendChild(newsModal);
            
            // Close modal on click
            newsModal.addEventListener('click', function(e) {
                if (e.target === this || e.target.closest('button')) {
                    this.remove();
                }
            });
        });
    });
});

// Function to generate the PDF certificate
function generateCertificate(donorData, patientData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add certificate title
    doc.setFontSize(22);
    doc.setTextColor('#e74c3c');
    doc.text('Blood Donation Certificate', 105, 30, null, null, 'center');

    // Add donor details
    doc.setFontSize(16);
    doc.setTextColor('#333');
    doc.text(`Certificate No: BD-${donorData.registrationId}`, 105, 50, null, null, 'center');
    doc.text(`This is to certify that`, 105, 70, null, null, 'center');
    doc.setFontSize(18);
    doc.setTextColor('#e74c3c');
    doc.text(donorData.fullName, 105, 80, null, null, 'center');
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text(`has successfully donated blood to`, 105, 90, null, null, 'center');
    doc.setFontSize(18);
    doc.setTextColor('#e74c3c');
    doc.text(patientData.patientName, 105, 100, null, null, 'center');

    // Add more details
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text(`Donor Blood Type: ${donorData.bloodType}`, 20, 120);
    doc.text(`Donor Phone: ${donorData.phoneNumber}`, 20, 130);
    doc.text(`Donor Email: ${donorData.email}`, 20, 140);
    doc.text(`Donor Location: ${donorData.location}`, 20, 150);
    doc.text(`Donation Date: ${donorData.registrationDate}`, 20, 160);

    // Add patient details
    doc.text(`Patient Name: ${patientData.patientName}`, 20, 180);
    doc.text(`Patient Blood Type: ${patientData.bloodType}`, 20, 190);
    doc.text(`Hospital: ${patientData.hospital}`, 20, 200);

    // Add fake signature
    doc.text('__________________________', 140, 220);
    doc.text('Dr. Sarah Johnson', 140, 230);
    doc.text('Medical Officer', 140, 240);
    doc.text('License: ML-2024-1234', 140, 250);

    // Save the PDF
    doc.save(`donor_certificate_${donorData.registrationId}.pdf`);
}

function generateReceipt(data) {
    const receiptHTML = `
        <div style="width: 400px; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #e74c3c; margin: 0;">LifeLink</h2>
                <p style="color: #666; margin: 5px 0;">Blood Donation Registration Receipt</p>
            </div>
            
            <div style="border-top: 2px solid #eee; border-bottom: 2px solid #eee; padding: 20px 0; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 0;"><strong>Registration ID:</strong></td>
                        <td style="text-align: right;">${data.registrationId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Date:</strong></td>
                        <td style="text-align: right;">${data.registrationDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Donor Name:</strong></td>
                        <td style="text-align: right;">${data.fullName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Blood Type:</strong></td>
                        <td style="text-align: right;">${data.bloodType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Contact:</strong></td>
                        <td style="text-align: right;">${data.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;"><strong>Location:</strong></td>
                        <td style="text-align: right;">${data.location}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
                <p>Please keep this receipt for future reference.</p>
                <p>For any queries, contact: info@lifelink.com</p>
            </div>
        </div>
    `;

    downloadPDF(receiptHTML, `donation_receipt_${data.registrationId}.pdf`);
}

// Add this function to handle PDF generation and download
function downloadPDF(html, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.html(html, {
        callback: function(doc) {
            doc.save(filename);
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650
    });
}

// Add this to your script.js
function initializeMatchingSystem() {
    const socket = io(); // Requires Socket.IO for real-time updates
    
    socket.on('matchFound', (data) => {
        showMatchNotification(data);
    });
}

function showMatchNotification(matchData) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-primary animate-slideIn';
    notification.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
                <i class="fas fa-handshake text-2xl text-primary"></i>
            </div>
            <div>
                <h4 class="font-semibold">Match Found!</h4>
                <p class="text-sm text-gray-600">A ${matchData.bloodType} recipient needs blood at ${matchData.hospital}</p>
                <div class="mt-3 flex space-x-3">
                    <button onclick="acceptMatch('${matchData.id}')" 
                        class="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition">
                        Accept
                    </button>
                    <button onclick="declineMatch('${matchData.id}')"
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition">
                        Decline
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
}

function acceptMatch(matchId) {
    // Send acceptance to server
    fetch('/api/matches/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId })
    })
    .then(response => response.json())
    .then(data => {
        // Show hospital directions and instructions
        showDirections(data.hospitalDetails);
    });
}

function setupDonationReminders(lastDonationDate) {
    // Calculate next eligible donation date (3 months from last donation)
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
    
    // Set up reminder notification
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Schedule reminder 1 day before eligibility
                const reminderDate = new Date(nextEligibleDate);
                reminderDate.setDate(reminderDate.getDate() - 1);
                
                const timeUntilReminder = reminderDate.getTime() - new Date().getTime();
                
                setTimeout(() => {
                    new Notification('Blood Donation Reminder', {
                        body: 'You will be eligible to donate blood tomorrow!',
                        icon: '/path/to/icon.png'
                    });
                }, timeUntilReminder);
            }
        });
    }
}

let map;
let donorMarker;

function initMap() {
    // Initialize the map centered at a default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to New Delhi
        zoom: 12
    });

    // Check if donor data is available
    const donorData = JSON.parse(localStorage.getItem('donorData'));
    if (donorData) {
        const donorLocation = { lat: parseFloat(donorData.locationLat), lng: parseFloat(donorData.locationLng) };
        addDonorMarker(donorLocation, donorData.isAvailable);
    }
}

function addDonorMarker(location, isAvailable) {
    // Add a marker for the donor
    donorMarker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Donor Location',
        icon: {
            url: isAvailable ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
    });

    // Center the map on the donor's location
    map.setCenter(location);
}

// Example function to update donor availability
function updateDonorAvailability(isAvailable) {
    const donorData = JSON.parse(localStorage.getItem('donorData'));
    donorData.isAvailable = isAvailable;
    localStorage.setItem('donorData', JSON.stringify(donorData));

    // Update marker icon based on availability
    donorMarker.setIcon({
        url: isAvailable ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
} 