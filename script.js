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

    // Donor form submission
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Please login first to register as a donor.');
            modal.style.display = "block";
            return;
        }

        // Collect form data
        const formData = {
            fullName: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            bloodType: this.querySelector('select').value,
            phoneNumber: this.querySelector('input[type="tel"]').value,
            location: this.querySelector('input[placeholder="Location"]').value,
            registrationDate: new Date().toLocaleDateString(),
            registrationId: 'BD' + Date.now().toString().slice(-6)
        };

        // Show success message with certificate download option
        const certificateModal = document.createElement('div');
        certificateModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm';
        certificateModal.innerHTML = `
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all animate-fadeIn">
                <div class="text-center mb-6">
                    <div class="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <i class="fas fa-check-circle text-4xl text-green-500"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800">Registration Successful!</h2>
                    <p class="text-gray-600 mt-2">Thank you for registering as a blood donor</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600">Registration ID:</span>
                        <span class="font-semibold">${formData.registrationId}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Date:</span>
                        <span>${formData.registrationDate}</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <button onclick="generateCertificate(${JSON.stringify(formData)})" 
                        class="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition duration-300 font-medium flex items-center justify-center space-x-2">
                        <i class="fas fa-certificate"></i>
                        <span>Download Certificate</span>
                    </button>
                    <button onclick="generateReceipt(${JSON.stringify(formData)})"
                        class="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-300 font-medium flex items-center justify-center space-x-2">
                        <i class="fas fa-receipt"></i>
                        <span>Download Receipt</span>
                    </button>
                    <button onclick="this.closest('.fixed').remove()" 
                        class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition duration-300 font-medium">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(certificateModal);
        this.reset();
    });

    // Request form submission
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Please login first to submit a blood request.');
            modal.style.display = "block";
            return;
        }
        alert('Blood request submitted successfully! We will process your request and contact you soon.');
        this.reset();
    });

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

// Add these functions for generating certificates and receipts
function generateCertificate(data) {
    const certificateHTML = `
        <div style="width: 800px; padding: 40px; border: 2px solid #e74c3c; border-radius: 10px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #e74c3c; font-size: 28px; margin-bottom: 10px;">Blood Donor Certificate</h1>
                <div style="color: #666;">Registration ID: ${data.registrationId}</div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVESURBVHic7ZtpiFVVGIbfO2opdlE0FkGWRBFR0Y9WrcyybCGiIoQKI4qyaIOKaBFbaMEwIlv4I6Kogbb8UUYULdgEUdkiZYFWRpEVLRNqVpTd0w/PueP97j1nzj3nnntnxvuBw7nfWs5593fW813OHSkQMEXSFEmTJY2XNFrSLkl/S1oraZWkNyR9HkJwJZ0zgACcBbwBbCfONmAZcE4/9bsTwBhgQQYj67MBmA/s2d/6xgBOAj7JaXgtPwLX9LfuOwAcB7zbpPH1eRwY2W86AxcCv7TI+Fr+BE7vF92BEcDDwL4OGl/LbmBmr+sNHAZ82EXGH7AAaGQVbQJW5GxvObBPL+oMXAps6iLDXwNOBgYDRwOzgG9ytrkZuKQX9AXuAPZ0gdEvAiMT9BwGzAX25Gh/D3BbN+oKDAHmAVUPg3cCc4DBTeg7FViZox/VKLvtpgHAocBST0N/Ae4HhmbUOw5Y7dGnpcBBnaQrMAFY52HcV8DxOXUPiUSKHH3bCBzfCboClwN/ORi0EzgfGNGC/gwCbgZ2OPRvB3BBu/QFpgFVB0O2AJe1Q/8IYLlDP6tRWbPpOgNTgL8dDFgHnNwJG4AZwA6H/m4GTmyFrsChwHsOHd8CTO6kLcBE4EeHcXwEHJJXV2Ao8KxDR38Aru4GmyLZ7Q7jeQo/l/1/XYDHHD5+P3B4txkEDAYedhjXI3n0vM+h0Q+7dTkk2PKYQ/+z5wPgWYfGvgMO6HajgKMc5oP5WfW8x6GhDcCYXjAKGAv84jC+u7LoOMGhke3AKb1kGHAq8IfDGI/NouNqhwa2Aqf1omGRrLbNYZxvp9VvuMPHdwATetk44GSH7TPA4Wmz/2KHj+8GpvWDccB0h8kQYFZa3Ucc5L8EJvWTccAFKQtqbV5Jq/uNDrLfA8f0o4HHAQ7FGeBhB9nNwNH9aSDpq0LbgRscZP8BxoUQdqXR7VIVlnQwsEzSyQ5VHgghvJFGr0sIYa2kRyVdnVJlkKSXJE0MIexM0usyB0h6UtJZKev/IenBtEpdQgjzJC1OWX2cpGdS63WQPwD4PuUvvxc4s5eNvzalrVuA/Zv5uMsc8JWkgxKK90qaE0J4PoXMHpIGSRoqaYSkEZKGS9pL0l5RGSFpH0nDJA2VtFVSRdJ2SVsl/SVpW1TeIWmLpN8lbZL0Wwhhe0LbiyRdkVD8Tgjh/CQZuRhfkTQzofhrSVeGEL5NkBku6URJE6IyXtI4SQdJGippSAZ1d0vaIukPSesl/SBpbVTWhBB2JMh+IenyhOKlIYQbmn48xRwwVNLPkvZPqLJc0k0hhF0Jxh8p6URJE6MyQdIRkgZnMDovOyStl7RW0mpJqyStCiH8Wl8phPBuQv0Nko4MIexu9OEkA0ZLWqPGy9UySbNCCNWEwR8v6QxJp0s6TdL+SQb0EL9KWilphaQPQwh/1haEEFYk1F0eQpje6GNJc8BsSU80KN4oaWoIYUPdoMdJukZmfKNJrldZL+l1SUtCCJ/VF4QQViTUezqEcFejDyUZ8Kakq+qKdkq6MITwSd1gL5Y0W9KlkrKcz/UyFUkvSnqm9pcOIaxIqHd3COHxRh9KMuBTSWfXFd0bQnisbrBTZbP9eXkHsAdZJulhSW+HEELCr/+4pPvqiu8JITzW6CNJBmyWNKqu6NQQwmd1g31BZnyWOO1DYKWkByS9H0KoJhifZMBxIYS1jT6QZEDScvVFCGFKC43qd0IIG5PKk+aApD3/jyGEhsveYEmfhhDOTKOgEMKvktak+N9/AEkGfNiFOvQsafYD3pJ0XhfqkIjMPYG8/AshDOV4/qkJ4QAAAABJRU5ErkJggg==" 
                    alt="Blood Drop Icon" style="width: 60px; height: 60px;">
            </div>
            
            <div style="margin-bottom: 30px;">
                <p style="font-size: 18px; line-height: 1.6; text-align: center;">
                    This is to certify that<br>
                    <span style="font-size: 24px; font-weight: bold; color: #e74c3c;">${data.fullName}</span><br>
                    has registered as a blood donor with LifeLink
                </p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; color: #666;">
                <div>
                    <p><strong>Blood Type:</strong> ${data.bloodType}</p>
                    <p><strong>Phone:</strong> ${data.phoneNumber}</p>
                </div>
                <div>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p><strong>Date:</strong> ${data.registrationDate}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">
                    This certificate is electronically generated and is valid for one year from the date of registration.
                </p>
            </div>
        </div>
    `;

    downloadPDF(certificateHTML, `donor_certificate_${data.registrationId}.pdf`);
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