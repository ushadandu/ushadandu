/**
 * DANDU USHA - PORTFOLIO INTERACTIVITY SCRIPT
 * Lightweight, accessible, and fast vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initActiveNavSpy();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to system preference, fallback to dark
  const storedTheme = localStorage.getItem('usha_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('usha_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
  }
}

/* ==========================================================================
   2. Responsive Mobile Navigation Menu
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navMenu.classList.add('open');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle.addEventListener('click', toggleMenu);

  // Close menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  // Close menu on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu on clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Active Navigation Scroll Spy (IntersectionObserver)
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   4. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. Clipboard Copy Utility & Toast Notification
   ========================================================================== */
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function copyToClipboard(text, customToastMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(customToastMsg || 'Copied to clipboard!');
      })
      .catch(() => {
        fallbackCopyText(text, customToastMsg);
      });
  } else {
    fallbackCopyText(text, customToastMsg);
  }
}

function fallbackCopyText(text, customToastMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(customToastMsg || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy. Please copy manually.');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   6. Contact Form Handler (Opens Default Mail Client)
   ========================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('sender-name')?.value.trim();
  const email = document.getElementById('sender-email')?.value.trim();
  const subject = document.getElementById('sender-subject')?.value.trim();
  const message = document.getElementById('sender-message')?.value.trim();

  const toEmail = 'ushadandu30@gmail.com';
  const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
  const mailBody = encodeURIComponent(
    `Hello Usha,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
  );

  const mailtoLink = `mailto:${toEmail}?subject=${mailSubject}&body=${mailBody}`;

  // Open default mail client
  window.location.href = mailtoLink;
  showToast('Opening default mail client...');
}
