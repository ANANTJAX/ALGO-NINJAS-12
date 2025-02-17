document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    
    // Form elements
    const donorForm = document.getElementById('donorForm');
    const requestForm = document.getElementById('bloodRequestForm');
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
    donorForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const donorData = {
                    fullName: donorForm.querySelector('input[placeholder="Full Name"]').value,
                    email: donorForm.querySelector('input[placeholder="Email"]').value,
                    phoneNumber: donorForm.querySelector('input[placeholder="Phone Number"]').value,
                    bloodType: donorForm.querySelector('select[name="bloodType"]').value,
                    locationLat: position.coords.latitude,
                    locationLng: position.coords.longitude,
                    preferredHospital: donorForm.querySelector('select[name="hospital"]').value
                };

                try {
                    const response = await fetch('/api/donors', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(donorData)
                    });
                    const result = await response.json();
                    console.log('Donor registered:', result);
                } catch (error) {
                    console.error('Error registering donor:', error);
                }
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Handle request form submission
    requestForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const patientData = {
            bloodGroup: requestForm.querySelector('select[name="bloodGroup"]').value,
            urgencyLevel: requestForm.querySelector('select[name="urgencyLevel"]').value,
            hospital: requestForm.querySelector('select[name="hospital"]').value
        };

        try {
            const response = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
            const result = await response.json();
            console.log('Patient request submitted:', result);
        } catch (error) {
            console.error('Error submitting patient request:', error);
        }
    });

    // Function to check for matches
    function checkForMatch(donorData = null, patientData = null) {
        if (!donorData) {
            donorData = JSON.parse(localStorage.getItem('donorData'));
        }
        if (!patientData) {
            patientData = JSON.parse(localStorage.getItem('patientData'));
        }

        if (donorData && patientData && donorData.bloodType === patientData.bloodGroup) {
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
            <p>Patient: ${patientData.patientName} (${patientData.bloodGroup})</p>
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
    doc.text(`Patient Blood Type: ${patientData.bloodGroup}`, 20, 190);
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
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.6139, lng: 77.2090 }, // Default center (Delhi)
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Initialize markers if blood donation system exists
    if (window.bloodDonationSystem) {
        window.bloodDonationSystem.updateMapMarkers();
    }

    // Add location search box
    const input = document.createElement('input');
    input.className = 'map-search-box';
    input.placeholder = 'Search location...';
    window.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBox = new google.maps.places.SearchBox(input);

    // Bias SearchBox results towards current map's viewport
    window.map.addListener('bounds_changed', () => {
        searchBox.setBounds(window.map.getBounds());
    });

    // Listen for location selection
    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;
            bounds.extend(place.geometry.location);
        });
        window.map.fitBounds(bounds);
    });
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

// Add this function to handle geolocation
function initializeGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('locationLat').value = position.coords.latitude;
                document.getElementById('locationLng').value = position.coords.longitude;
                
                // Show success message
                const locationStatus = document.getElementById('locationStatus');
                locationStatus.textContent = '📍 Location captured successfully';
                locationStatus.classList.remove('text-red-500');
                locationStatus.classList.add('text-green-500');
            },
            (error) => {
                const locationStatus = document.getElementById('locationStatus');
                locationStatus.textContent = '❌ Please enable location access';
                locationStatus.classList.add('text-red-500');
            }
        );
    }
}

// Add real-time matching functionality
function findNearbyDonors(patientData) {
    const maxDistance = 10; // km
    
    return fetch('/api/donors/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bloodGroup: patientData.bloodGroup,
            hospital: patientData.hospital,
            urgencyLevel: patientData.urgencyLevel,
            maxDistance
        })
    })
    .then(response => response.json())
    .then(donors => {
        if (donors.length > 0) {
            showMatchNotification(donors, patientData);
        } else {
            showNoMatchMessage();
        }
    });
}

// Enhanced notification system
function showMatchNotification(donors, patientData) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl border-l-4 border-primary max-w-md animate-slideIn';
    
    const donorsList = donors.map(donor => `
        <div class="donor-card mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">${donor.fullName}</h4>
                    <p class="text-sm text-gray-600">Blood Type: ${donor.bloodType}</p>
                </div>
                <button onclick="connectWithDonor('${donor._id}')" 
                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                    Connect
                </button>
            </div>
        </div>
    `).join('');

    notificationDiv.innerHTML = `
        <h3 class="text-lg font-bold mb-4">Matching Donors Found</h3>
        <div class="max-h-60 overflow-y-auto">
            ${donorsList}
        </div>
    `;

    document.body.appendChild(notificationDiv);
}

// Add validation for the health questionnaire
function validateHealthQuestionnaire(formData) {
    // Weight validation (minimum 50kg for donors)
    if (formData.get('weight') < 50) {
        alert('Minimum weight requirement for blood donation is 50kg');
        return false;
    }

    // Age validation (18-65 years)
    const birthDate = new Date(formData.get('birthDate'));
    const age = calculateAge(birthDate);
    if (age < 18 || age > 65) {
        alert('Blood donors must be between 18 and 65 years of age');
        return false;
    }

    // Check for recent medical procedures
    if (formData.get('recentProcedures').includes('tattoo') || 
        formData.get('recentProcedures').includes('dental_extraction')) {
        const procedureDate = new Date(formData.get('procedureDate'));
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (procedureDate > sixMonthsAgo) {
            alert('You must wait 6 months after getting a tattoo or dental extraction');
            return false;
        }
    }

    return true;
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

class BloodDonationSystem {
    constructor() {
        this.donors = new Map();
        this.requests = new Map();
        this.markers = [];
        this.initializeStorage();
        this.setupEventListeners();
        this.loadExistingData();
    }

    initializeStorage() {
        // Load existing data from localStorage
        const storedDonors = localStorage.getItem('donors');
        const storedRequests = localStorage.getItem('requests');
        
        if (storedDonors) {
            JSON.parse(storedDonors).forEach(donor => {
                this.donors.set(donor.id, donor);
            });
        }
        
        if (storedRequests) {
            JSON.parse(storedRequests).forEach(request => {
                this.requests.set(request.id, request);
            });
        }
    }

    loadExistingData() {
        // Display existing donors and requests
        this.donors.forEach(donor => this.displayDonor(donor));
        this.requests.forEach(request => this.displayRequest(request));
        this.updateMapMarkers();
    }

    setupEventListeners() {
        // Donor form submission
        const donorForm = document.getElementById('donorForm');
        donorForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDonorSubmission(new FormData(donorForm));
        });

        // Request form submission
        const requestForm = document.getElementById('bloodRequestForm');
        requestForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRequestSubmission(new FormData(requestForm));
        });
    }

    handleDonorSubmission(formData) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const donor = {
                        id: Date.now().toString(),
                        name: formData.get('fullName'),
                        email: formData.get('email'),
                        phone: formData.get('phoneNumber'),
                        bloodType: formData.get('bloodType'),
                        locationLat: position.coords.latitude,
                        locationLng: position.coords.longitude,
                        available: true,
                        timestamp: new Date().toISOString()
                    };

                    this.donors.set(donor.id, donor);
                    this.saveDonors();
                    this.displayDonor(donor);
                    this.updateMapMarkers();
                    this.showSuccessMessage('Thank you for registering as a donor!');
                    
                    // Check for matching requests
                    this.findMatchingRequests(donor);
                },
                (error) => {
                    alert('Please enable location access to register as a donor');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    }

    displayDonor(donor) {
        const donorsList = document.getElementById('donorsList');
        const donorElement = document.createElement('div');
        donorElement.id = `donor-${donor.id}`;
        donorElement.className = 'bg-gray-50 p-4 rounded-lg shadow border-l-4 border-primary animate-slideIn';
        
        donorElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <span class="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                        ${donor.bloodType}
                    </span>
                    <h4 class="font-medium">${donor.name}</h4>
                    <p class="text-sm text-gray-600">Available for donation</p>
                    <p class="text-sm text-gray-600">Registered: ${this.formatTimeAgo(donor.timestamp)}</p>
                </div>
                <button onclick="bloodDonationSystem.contactDonor('${donor.id}')"
                    class="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition">
                    Contact
                </button>
            </div>
        `;
        
        // Add to the beginning of the list
        if (donorsList.firstChild) {
            donorsList.insertBefore(donorElement, donorsList.firstChild);
        } else {
            donorsList.appendChild(donorElement);
        }
    }

    findMatchingRequests(donor) {
        const matches = Array.from(this.requests.values()).filter(request => 
            request.status === 'active' && request.bloodType === donor.bloodType
        );

        if (matches.length > 0) {
            this.showMatchingRequestsNotification(matches, donor);
        }
    }

    showMatchingRequestsNotification(requests, donor) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl border-l-4 border-primary max-w-md animate-slideIn';
        
        const requestsList = requests.map(request => `
            <div class="request-card mb-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold">${request.hospital}</h4>
                        <p class="text-sm text-gray-600">Blood Type: ${request.bloodType}</p>
                        <p class="text-sm text-gray-600">Posted: ${this.formatTimeAgo(request.timestamp)}</p>
                    </div>
                    <button onclick="bloodDonationSystem.respondToRequest('${request.id}')" 
                        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                        Respond
                    </button>
                </div>
            </div>
        `).join('');

        notificationDiv.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Matching Requests Found</h3>
            <div class="max-h-60 overflow-y-auto">
                ${requestsList}
            </div>
        `;

        document.body.appendChild(notificationDiv);
    }

    contactDonor(donorId) {
        const donor = this.donors.get(donorId);
        if (donor) {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            contactDiv.innerHTML = `
                <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                    <h3 class="text-lg font-bold mb-4">Contact Donor</h3>
                    <p class="mb-2">Name: ${donor.name}</p>
                    <p class="mb-2">Phone: ${donor.phone}</p>
                    <p class="mb-4">Email: ${donor.email}</p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                        class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                        Close
                    </button>
                </div>
            `;
            document.body.appendChild(contactDiv);
        }
    }

    saveDonors() {
        localStorage.setItem('donors', JSON.stringify(Array.from(this.donors.values())));
    }

    saveRequests() {
        localStorage.setItem('requests', JSON.stringify(Array.from(this.requests.values())));
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'fixed bottom-4 left-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-slideIn';
        messageDiv.innerHTML = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showNoMatchMessage() {
        // Implementation of showNoMatchMessage method
    }

    displayRequest(request) {
        const requestsList = document.getElementById('requestsList');
        const requestElement = document.createElement('div');
        requestElement.id = `request-${request.id}`;
        requestElement.className = 'bg-gray-50 p-4 rounded-lg shadow border-l-4 border-primary animate-slideIn';
        
        requestElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <span class="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                        ${request.bloodType}
                    </span>
                    <h4 class="font-medium">${request.hospital}</h4>
                    <p class="text-sm text-gray-600">Contact: ${request.contactName}</p>
                    <p class="text-sm text-gray-600">Posted: ${this.formatTimeAgo(request.timestamp)}</p>
                </div>
                ${request.status === 'active' ? `
                    <button onclick="bloodDonationSystem.respondToRequest('${request.id}')"
                        class="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition">
                        Respond
                    </button>
                ` : `
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                        Fulfilled
                    </span>
                `}
            </div>
        `;
        
        // Add to the beginning of the list
        if (requestsList.firstChild) {
            requestsList.insertBefore(requestElement, requestsList.firstChild);
        } else {
            requestsList.appendChild(requestElement);
        }
    }

    respondToRequest(requestId) {
        const request = this.requests.get(requestId);
        if (request) {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            contactDiv.innerHTML = `
                <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                    <h3 class="text-lg font-bold mb-4">Contact Information</h3>
                    <p class="mb-2">Patient Contact: ${request.contactName}</p>
                    <p class="mb-2">Phone: ${request.contactPhone}</p>
                    <p class="mb-4">Hospital: ${request.hospital}</p>
                    <div class="space-y-2">
                        <button onclick="bloodDonationSystem.confirmDonation('${requestId}')" 
                            class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                            Confirm Donation
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                            Close
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(contactDiv);
        }
    }

    confirmDonation(requestId) {
        const request = this.requests.get(requestId);
        if (request) {
            request.status = 'fulfilled';
            this.saveRequests();
            
            // Update the request display
            const requestElement = document.getElementById(`request-${requestId}`);
            if (requestElement) {
                requestElement.querySelector('button').outerHTML = `
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                        Fulfilled
                    </span>
                `;
            }
            
            this.showSuccessMessage('Thank you for donating blood!');
            
            // Close the contact modal
            const modal = document.querySelector('.fixed.inset-0');
            if (modal) modal.remove();
        }
    }

    formatTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (let [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        
        return 'Just now';
    }
}

// Initialize the system
const bloodDonationSystem = new BloodDonationSystem();

class BloodDonationFilter {
    constructor(system) {
        this.system = system;
        this.setupFilters();
    }

    setupFilters() {
        const bloodTypeFilter = document.getElementById('bloodTypeFilter');
        const locationFilter = document.getElementById('locationFilter');

        bloodTypeFilter.addEventListener('change', () => this.applyFilters());
        locationFilter.addEventListener('input', () => this.applyFilters());
    }

    applyFilters() {
        const bloodType = document.getElementById('bloodTypeFilter').value;
        const location = document.getElementById('locationFilter').value.toLowerCase();

        const filteredDonors = Array.from(this.system.donors.values()).filter(donor => {
            const matchesBloodType = !bloodType || donor.bloodType === bloodType;
            const matchesLocation = !location || 
                donor.location.toLowerCase().includes(location);
            return matchesBloodType && matchesLocation;
        });

        this.system.updateDonorsList(filteredDonors);
    }
} 