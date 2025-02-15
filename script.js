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

    // Login Modal functionality
    loginBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Simple validation
        if (email && password) {
            alert('Login successful!');
            modal.style.display = "none";
            loginBtn.textContent = 'Logout';
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
        }
    });

    // Check login state on page load
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginBtn.textContent = 'Logout';
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

    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 