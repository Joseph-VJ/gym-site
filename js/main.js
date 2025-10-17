/**
 * Sri Maha Fitness Centre - Main JavaScript
 * Handles navigation, forms, animations, and interactive elements
 */

(function() {
  'use strict';

  /* ==========================================================================
     Mobile Navigation Toggle
     ========================================================================== */
  
  const initMobileNav = () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navList) return;
    
    // Toggle menu
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('nav__list--active');
      navToggle.setAttribute(
        'aria-expanded',
        navList.classList.contains('nav__list--active')
      );
      
      // Toggle icon
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('nav__list--active');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('nav__list--active');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  };

  /* ==========================================================================
     Active Navigation Link
     ========================================================================== */
  
  const setActiveNavLink = () => {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  };

  /* ==========================================================================
     Smooth Scrolling
     ========================================================================== */
  
  const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just '#'
        if (href === '#') {
          e.preventDefault();
          return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  /* ==========================================================================
     Back to Top Button
     ========================================================================== */
  
  const initBackToTop = () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('back-to-top--visible');
      } else {
        backToTopBtn.classList.remove('back-to-top--visible');
      }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  /* ==========================================================================
     Form Validation
     ========================================================================== */
  
  const initFormValidation = () => {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form elements
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const serviceInput = document.getElementById('service');
      const messageInput = document.getElementById('message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      
      // Clear previous errors
      clearErrors();
      
      // Validate
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      }
      
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (!serviceInput.value) {
        showError(serviceInput, 'Please select a service');
        isValid = false;
      }
      
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
      }
      
      if (isValid) {
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission (replace with actual backend call)
        setTimeout(() => {
          // Show success message
          showSuccessMessage(contactForm);
          
          // Reset form
          contactForm.reset();
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }, 1500);
      }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('form-input--error')) {
          validateField(input);
        }
      });
    });
  };
  
  const validateField = (field) => {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    if (!value && field.hasAttribute('required')) {
      showError(field, `Please enter your ${fieldName}`);
      return false;
    }
    
    if (fieldName === 'email' && value && !isValidEmail(value)) {
      showError(field, 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const showError = (field, message) => {
    field.classList.add('form-input--error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('form-error')) {
      errorElement = document.createElement('span');
      errorElement.classList.add('form-error');
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
  };
  
  const clearFieldError = (field) => {
    field.classList.remove('form-input--error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
      errorElement.remove();
    }
  };
  
  const clearErrors = () => {
    const errorInputs = document.querySelectorAll('.form-input--error, .form-textarea--error, .form-select--error');
    errorInputs.forEach(input => {
      input.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');
    });
    
    const errorMessages = document.querySelectorAll('.form-error');
    errorMessages.forEach(msg => msg.remove());
  };
  
  const showSuccessMessage = (form) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.style.cssText = `
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #c3e6cb;
    `;
    successDiv.innerHTML = '<strong>Success!</strong> Your message has been sent. We\'ll get back to you soon!';
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /* ==========================================================================
     Scroll Animations (Intersection Observer)
     ========================================================================== */
  
  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll(
      '.card, .service-card, .pricing-card, .service-detail, .about-content'
    );
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );
      
      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  };

  /* ==========================================================================
     Header Shadow on Scroll
     ========================================================================== */
  
  const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }
    });
  };

  /* ==========================================================================
     Initialize All Functions
     ========================================================================== */
  
  const init = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initMobileNav();
        setActiveNavLink();
        initSmoothScroll();
        initBackToTop();
        initFormValidation();
        initScrollAnimations();
        initHeaderScroll();
      });
    } else {
      initMobileNav();
      setActiveNavLink();
      initSmoothScroll();
      initBackToTop();
      initFormValidation();
      initScrollAnimations();
      initHeaderScroll();
    }
  };
  
  // Initialize
  init();
  
})();
