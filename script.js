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
        alert('Thank you for registering as a donor! We will contact you soon.');
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