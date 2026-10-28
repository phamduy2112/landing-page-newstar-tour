/**
 * Interactive Script for Travel Landing Page
 * Handles: Mobile Menu, Tab Filtering, Accordion FAQ, Form Validation & Auto-fill
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // 2. Tab Filtering for Tours
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tourCards = document.querySelectorAll('.tour-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterCategory = button.getAttribute('data-tab');

      tourCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      if (!isExpanded) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });

  // 4. Quick Finder Action
  const quickFinderForm = document.getElementById('quickFinderForm');
  if (quickFinderForm) {
    quickFinderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destSelect = document.getElementById('findDestination');
      const selectedDestText = destSelect.options[destSelect.selectedIndex].text;
      
      // Auto-select tour in lead form
      const bookingSection = document.getElementById('booking-form');
      const selectedTourInput = document.getElementById('selectedTour');
      
      if (selectedDestText.includes('Phú Quốc')) {
        selectedTourInput.value = 'Phú Quốc 3N2Đ';
      } else if (selectedDestText.includes('Đà Nẵng')) {
        selectedTourInput.value = 'Đà Nẵng - Hội An 4N3Đ';
      } else if (selectedDestText.includes('Sa Pa')) {
        selectedTourInput.value = 'Sa Pa Fansipan 3N2Đ';
      } else if (selectedDestText.includes('Thái Lan')) {
        selectedTourInput.value = 'Thái Lan Bangkok Pattaya 5N4Đ';
      }

      bookingSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 5. Lead Form Submission & Validation
  const leadForm = document.getElementById('leadForm');
  const fullName = document.getElementById('fullName');
  const phoneNumber = document.getElementById('phoneNumber');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

      // Validate Name
      if (!fullName.value.trim()) {
        fullName.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        fullName.parentElement.classList.remove('has-error');
      }

      // Validate Phone
      if (!phoneRegex.test(phoneNumber.value.trim())) {
        phoneNumber.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        phoneNumber.parentElement.classList.remove('has-error');
      }

      if (!isValid) return;

      // Simulate API submit state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Đang gửi thông tin...</span>';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        formStatus.className = 'form-status success';
        formStatus.textContent = '🎉 Đăng ký thành công! Chuyên viên sẽ gọi điện tư vấn và gửi lịch trình chi tiết qua Zalo cho bạn trong ít phút.';
        leadForm.reset();
      }, 1000);
    });

    // Clear error on input
    fullName.addEventListener('input', () => fullName.parentElement.classList.remove('has-error'));
    phoneNumber.addEventListener('input', () => phoneNumber.parentElement.classList.remove('has-error'));
  }

  // 6. Scroll Reveal Animations (Tự động kích hoạt hiệu ứng hiện dần khi cuộn tới)
  const revealElements = document.querySelectorAll(
    '.section-header, .journey-card, .tour-card, .timeline-block, .cuisine-bento-card, .fleet-container, .benefit-card, .bento-gallery, .review-card, .booking-wrapper, .accordion-item'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  // Thêm độ trễ nhẹ (stagger) cho các nhóm thẻ nằm cạnh nhau
  document.querySelectorAll('.route-showcase, .tour-grid, .cuisine-bento-grid, .benefits-grid, .review-grid').forEach(parent => {
    Array.from(parent.children).forEach((child, idx) => {
      if (child.classList.contains('reveal')) {
        child.classList.add(`reveal-delay-${(idx % 4) + 1}`);
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
});

// Helper for "Tư Vấn Ngay" button on tour cards
window.selectTour = function(tourName) {
  const selectedTourInput = document.getElementById('selectedTour');
  if (selectedTourInput) {
    selectedTourInput.value = tourName;
  }
};
