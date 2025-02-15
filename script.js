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

        // Show success modal with download option
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm';
        successModal.innerHTML = `
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
                    <button onclick="this.closest('.fixed').remove()" 
                        class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition duration-300 font-medium">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(successModal);
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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add hospital logo/header
    doc.setFillColor(231, 76, 60); // Red header
    doc.rect(0, 0, 210, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('LifeLink Blood Bank & Research Center', 105, 10, { align: 'center' });

    // Certificate title
    doc.setTextColor(231, 76, 60);
    doc.setFontSize(24);
    doc.text('Blood Donor Certificate', 105, 35, { align: 'center' });

    // Certificate number
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Certificate No: LF-${data.registrationId}`, 105, 45, { align: 'center' });

    // Main certification text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('This is to certify that', 105, 60, { align: 'center' });
    
    // Donor name
    doc.setFontSize(18);
    doc.setTextColor(231, 76, 60);
    doc.text(data.fullName.toUpperCase(), 105, 70, { align: 'center' });

    // Certification text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('has been registered as a voluntary blood donor with our organization.', 105, 80, { align: 'center' });

    // Donor Details Box
    doc.setDrawColor(231, 76, 60);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 90, 170, 60, 3, 3);
    
    doc.setFontSize(14);
    doc.setTextColor(231, 76, 60);
    doc.text('Donor Details', 30, 105);

    // Donor information
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const details = [
        [`Blood Type: ${data.bloodType}`, `Registration Date: ${data.registrationDate}`],
        [`Phone: ${data.phoneNumber}`, `Valid Until: ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}`],
        [`Email: ${data.email}`, `Next Eligible Donation: ${new Date(new Date().setDate(new Date().getDate() + 90)).toLocaleDateString()}`],
        [`Address: ${data.location}`, `Donor ID: ${data.registrationId}`]
    ];

    let yPos = 120;
    details.forEach(row => {
        doc.text(row[0], 30, yPos);
        doc.text(row[1], 110, yPos);
        yPos += 10;
    });

    // Hospital Details Box
    doc.roundedRect(20, 160, 170, 35, 3, 3);
    doc.setFontSize(11);
    doc.text([
        'Hospital: LifeLink Blood Bank & Research Center',
        'Address: 123 Medical Plaza, Healthcare District, City, State - 12345',
        'Contact: +1 (555) 123-4567  |  Email: info@lifelink.com'
    ], 30, 175);

    // Signatures
    doc.setFontSize(11);
    
    // Medical Officer Signature
    doc.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAYAAAAIeF9DAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAOASURBVGiB7ZpNiBxFFMd/1T2zK1k/omJUFFGJH0g8GEHXeNK4Bj14UVBjwHjw4EEEL4KXgAY8ehC9Kh4UQQ9+IBrxICioKLtRUXQVRBAVjUrcrO7s9Ie7q6q7X1V3zUz3JLvzh2Z3qt579eqrV/XqVfUWnEXBWABuA+4HrgZ2AWeBE8DnwHPAy0ChxEeJZ+71MvA28DhwB7ATuAzYClwJ3AM8C7wFnARGwPsT8ZxFQQAMAB34vgpYD9SADcAqTdPAX8Bx4CjwFfA58KPMU+I5e70AXA5sBK4D1gNrgTXAeuAa4D7gIPA18APwD/Bj4jnrCYChxEeJZ+71KeAb4FPgEHAYOAP8BZwCvgM+AN4B3gSOyTwlnrPXfwLfAp8BHwEfA78AfwIngO+Bg8DrwGvAz8Bw1hMCQwGQeM5eB0AKrAJWA5cCVwA3AXuA24FbgZuBGzRN4jl7vQpYA1wAbAIuBK4FbgXuBG4DbpF5SjxnPSEwFACJ5+x1E+NNwE5gO3ApsEXTJJ6z15uZbGC2A9uArZom8Zy9bkp8h8RTAZAkPgKGQAtoR3iWeM5eD5lsYIZMNjASz9nrtsR3SDwVAEniI2AIzGNOZB7oAD1gEOFZ4jl73WOygekx2cBIPGev+xLfIfFUACSJj4A2xoQOxoQBxoQhMIrwLPGcvR4y2cAMmWxgJJ6z1yOJ75B4KgCSxEdAC2NCG2NCH2NCGxhGeJZ4zl4PmGxgBkw2MBLP2euBxHdIPBUASeIjoIkxoY0xoYcxoQUMIjxLPGevB0w2MAMmGxiJ5+z1UOI7JJ4KgCTxEdDAmNDCmNDDmNAABhGeJZ6z132MCX0mGxiJ5+x1X+I7JJ4KgCTxEVDHmNDEmNDFmFAH+hGeJZ6z1z0mG5gekw2MxHP2uifxHRJPBUCS+AioYUyoY0zoYEyoAb0IzxLP2esuxoQukw2MxHP2uivxHRJPBUCS+AioYkyoYUzoYEyoAt0IzxLP2esOxoQOkw2MxHP2uiPxHRJPBUCS+AioYEyoYkxoY0yoAJ0IzxLP2es2xoQ2kw2MxHP2ui3xHRJPBUCS+AjIMSbkGBNaGBNyoBPhWeI5e93CmNBisoGReM5etyS+Q+KpAEgSHwEZxoQMY0IDY0IGtCM8SzxnrxsYExoYEzKJ5+x1Q+I7JJ4KgCTxEfA/YTcYvzG6Gi4AAAAASUVORK5CYII=', 30, 210, 40, 20);
    doc.text('Dr. Sarah Johnson', 30, 240);
    doc.text('Medical Officer', 30, 245);
    doc.text('License: ML-2024-1234', 30, 250);

    // Director Signature
    doc.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAYAAAAIeF9DAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAOASURBVGiB7ZpNiBxFFMd/1T2zK1k/omJUFFGJH0g8GEHXeNK4Bj14UVBjwHjw4EEEL4KXgAY8ehC9Kh4UQQ9+IBrxICioKLtRUXQVRBAVjUrcrO7s9Ie7q6q7X1V3zUz3JLvzh2Z3qt579eqrV/XqVfUWnEXBWABuA+4HrgZ2AWeBE8DnwHPAy0ChxEeJZ+71MvA28DhwB7ATuAzYClwJ3AM8C7wFnARGwPsT8ZxFQQAMAB34vgpYD9SADcAqTdPAX8Bx4CjwFfA58KPMU+I5e70AXA5sBK4D1gNrgTXAeuAa4D7gIPA18APwD/Bj4jnrCYChxEeJZ+71KeAb4FPgEHAYOAP8BZwCvgM+AN4B3gSOyTwlnrPXfwLfAp8BHwEfA78AfwIngO+Bg8DrwGvAz8Bw1hMCQwGQeM5eB0AKrAJWA5cCVwA3AXuA24FbgZuBGzRN4jl7vQpYA1wAbAIuBK4FbgXuBG4DbpF5SjxnPSEwFACJ5+x1E+NNwE5gO3ApsEXTJJ6z15uZbGC2A9uArZom8Zy9bkp8h8RTAZAkPgKGQAtoR3iWeM5eD5lsYIZMNjASz9nrtsR3SDwVAEniI2AIzGNOZB7oAD1gEOFZ4jl73WOygekx2cBIPGev+xLfIfFUACSJj4A2xoQOxoQBxoQhMIrwLPGcvR4y2cAMmWxgJJ6z1yOJ75B4KgCSxEdAC2NCG2NCH2NCGxhGeJZ4zl4PmGxgBkw2MBLP2euBxHdIPBUASeIjoIkxoY0xoYcxoQUMIjxLPGevB0w2MAMmGxiJ5+z1UOI7JJ4KgCTxEdDAmNDCmNDDmNAABhGeJZ6z132MCX0mGxiJ5+x1X+I7JJ4KgCTxEVDHmNDEmNDFmFAH+hGeJZ6z1z0mG5gekw2MxHP2uifxHRJPBUCS+AioYUyoY0zoYEyoAb0IzxLP2esuxoQukw2MxHP2uivxHRJPBUCS+AioYkyoYUzoYEyoAt0IzxLP2esOxoQOkw2MxHP2uiPxHRJPBUCS+AioYEyoYkxoY0yoAJ0IzxLP2es2xoQ2kw2MxHP2ui3xHRJPBUCS+AjIMSbkGBNaGBNyoBPhWeI5e93CmNBisoGReM5etyS+Q+KpAEgSHwEZxoQMY0IDY0IGtCM8SzxnrxsYExoYEzKJ5+x1Q+I7JJ4KgCTxEfA/YTcYvzG6Gi4AAAAASUVORK5CYII=', 140, 210, 40, 20);
    doc.text('Dr. Michael Chen', 140, 240);
    doc.text('Medical Director', 140, 245);
    doc.text('Hospital Seal', 140, 250);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is electronically generated and is valid for one year from the date of registration.', 105, 270, { align: 'center' });

    // Save the PDF
    doc.save(`blood_donor_certificate_${data.registrationId}.pdf`);
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