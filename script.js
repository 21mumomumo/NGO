// JavaScript for handling form submissions and interactivity


// Handle donation form submission
async function handleDonation(event) {
    event.preventDefault();
    const form = event.target;
    const amount = parseFloat(form.querySelector('input[type="number"]').value);
    const isMonthly = form.classList.contains('monthly-donation');

    try {
        const response = await fetch('/api/donations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                type: isMonthly ? 'monthly' : 'one-time'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to process donation');
        }

        const data = await response.json();
        alert('Thank you for your donation!');
        form.reset();
    } catch (error) {
        console.error('Error processing donation:', error);
        alert('Failed to process donation. Please try again.');
    }
}

// Handle user registration
async function handleRegistration(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('#reg-name').value;
    const email = form.querySelector('#reg-email').value;
    const password = form.querySelector('#reg-password').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        alert('Registration successful! Please log in.');
        // Switch to login form
        document.getElementById('register-form-container').style.display = 'none';
        document.getElementById('login-form').closest('.login-box').style.display = 'block';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
    }
}

// Handle amount button selection
document.querySelectorAll('button[type="button"]').forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.closest('form');
        const input = parent.querySelector('input[type="number"]');
        const amount = this.textContent.replace(/[^\d.]/g, '');
        input.value = amount;

        parent.querySelectorAll('button[type="button"]').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'bg-indigo-50');
        });
        this.classList.add(this.classList.contains('hover:bg-blue-50') ? 'bg-blue-50' : 'bg-indigo-50');
    });
});

// Add form submission handlers
document.querySelectorAll('form').forEach(form => {
    if (form.id === 'register-form') {
        form.addEventListener('submit', handleRegistration);
    } else {
        form.addEventListener('submit', handleDonation);
    }
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

// Handle scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});


// Add ripple effect to elements
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.className = 'ripple';
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// Smooth scroll to Mpesa button
function scrollToMpesa() {
    const mpesaButton = document.querySelector('#mpesa-button');
    if (mpesaButton) {
        mpesaButton.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            createRipple({ 
                currentTarget: mpesaButton,
                clientX: mpesaButton.getBoundingClientRect().left + mpesaButton.offsetWidth / 2,
                clientY: mpesaButton.getBoundingClientRect().top + mpesaButton.offsetHeight / 2
            });
        }, 1000);
    }
}

// Add event listeners to donation buttons
document.addEventListener('DOMContentLoaded', () => {
    const donateButtons = document.querySelectorAll('[data-scroll-to-mpesa]');
    donateButtons.forEach(button => {
        button.addEventListener('click', scrollToMpesa);
    });
});

