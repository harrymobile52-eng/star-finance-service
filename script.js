/* ========================================
   STAR FINANCE SERVICE - SCRIPT.JS
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

// ========================================
// 1. Mobile Navbar Toggle
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
  
  document.addEventListener('click', function(e) {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
}

// ========================================
// 2. Smooth Scrolling
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// ========================================
// 3. EMI Calculator
// ========================================
const emiForm = document.querySelector('.emi-calculator');
if (emiForm) {
  const amountInput = document.getElementById('loan-amount');
  const rateInput = document.getElementById('interest-rate');
  const tenureInput = document.getElementById('loan-tenure');
  const calcBtn = emiForm.querySelector('.btn-calculate');
  const resultEl = emiForm.querySelector('.result-amount .amount');
  const totalIntEl = emiForm.querySelector('.total-interest span:last-child');
  const totalPayEl = emiForm.querySelector('.total-payment span:last-child');
  
  if (calcBtn) {
    calcBtn.addEventListener('click', function() {
      const P = parseFloat(amountInput.value);
      const r = parseFloat(rateInput.value) / 12 / 100;
      const n = parseInt(tenureInput.value);
      
      if (!P || !r || !n || P <= 0 || r <= 0 || n <= 0) {
        alert('Please enter valid values');
        return;
      }
      
      const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      const interest = total - P;
      
      resultEl.textContent = '₹' + emi.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      totalIntEl.textContent = '₹' + interest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      totalPayEl.textContent = '₹' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
  }
}

// ========================================
// 4. Eligibility Checker
// ========================================
const checkerForm = document.querySelector('.eligibility-checker');
if (checkerForm) {
  const nameInput = document.getElementById('full-name');
  const incomeInput = document.getElementById('monthly-income');
  const empType = document.getElementById('employment-type');
  const existingEMI = document.getElementById('existing-emi');
  const checkBtn = checkerForm.querySelector('.btn-check');
  const statusEl = checkerForm.querySelector('.result-status .status');
  const amountEl = checkerForm.querySelector('.eligible-amount span:last-child');
  const rateEl = checkerForm.querySelector('.interest-rate span:last-child');
  
  const rates = { 'salaried': 10.5, 'self-employed': 12, 'business-owner': 14, 'professional': 11.5, 'retired': 13 };
  
  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      const income = parseFloat(incomeInput.value);
      const existing = parseFloat(existingEMI.value) || 0;
      const emp = empType.value;
      
      if (!nameInput.value || !income || !emp) {
        alert('Please fill all fields');
        return;
      }
      
      const maxEMI = income * 0.5 - existing;
      const rate = rates[emp] || 12;
      
      if (maxEMI <= 0) {
        statusEl.textContent = 'Not Eligible';
        statusEl.style.color = '#dc3545';
        amountEl.textContent = 'N/A';
        rateEl.textContent = rate + '% p.a.';
        return;
      }
      
      const r = rate / 12 / 100;
      const months = 60;
      const eligible = maxEMI * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
      
      statusEl.textContent = eligible >= 5000 ? 'Eligible' : 'Partially Eligible';
      statusEl.style.color = eligible >= 5000 ? '#28a745' : '#ffc107';
      amountEl.textContent = '₹' + Math.floor(eligible).toLocaleString();
      rateEl.textContent = rate + '% p.a.';
    });
  }
}

// ========================================
// 5. Counter Animation
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const text = stat.textContent;
          let target = 0;
          
          if (text.includes('B')) target = parseFloat(text.replace(/[^0-9.]/g, '')) * 1e9;
          else if (text.includes('K')) target = parseFloat(text.replace(/[^0-9.]/g, '')) * 1000;
          else if (text.includes('%')) target = parseFloat(text.replace(/[^0-9.]/g, ''));
          else if (text.includes('/')) target = 24;
          else target = parseFloat(text.replace(/[^0-9.]/g, ''));
          
          animateValue(stat, 0, target, 2000);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(document.querySelector('.stats-container'));
}

function animateValue(el, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOut;
    
    if (end >= 1e9) el.textContent = '₹' + Math.floor(current / 1e9).toFixed(1) + 'B+';
    else if (end >= 1000) el.textContent = '₹' + Math.floor(current / 1000).toFixed(0) + 'K+';
    else if (end === 24) el.textContent = Math.floor(current) + '/7';
    else if (end > 100) el.textContent = Math.floor(current) + '%';
    else el.textContent = Math.floor(current) + '+';
    
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

// ========================================
// 6. Scroll Reveal Animation
// ========================================
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

// Back to top button
const backBtn = document.createElement('button');
backBtn.innerHTML = '&#8593;';
backBtn.setAttribute('aria-label', 'Back to top');
backBtn.className = 'back-to-top';
backBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  background: #003b5c;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
`;
document.body.appendChild(backBtn);

window.addEventListener('scroll', function() {
  backBtn.style.opacity = window.pageYOffset > 300 ? '1' : '0';
  backBtn.style.visibility = window.pageYOffset > 300 ? 'visible' : 'hidden';
});

backBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

});