// ── Scroll reveal
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

// ── Course tabs
document.querySelectorAll('.tab-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Scroll to top
const st = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  st.classList.toggle('show', window.scrollY > 320);
  document.querySelector('.site-header').style.boxShadow =
    window.scrollY > 10 ? '0 3px 20px rgba(0,0,0,.10)' : '0 2px 15px rgba(0,0,0,.06)';
});
st.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Testimonial dots
document.querySelectorAll('.tdot').forEach((d) => {
  d.addEventListener('click', () => {
    document.querySelectorAll('.tdot').forEach(x => x.classList.remove('on'));
    d.classList.add('on');
  });
});

// ── How It Works: 3D tilt on mouse move + click to highlight text blue
document.querySelectorAll('.step-card').forEach(card => {

  // 3D tilt effect on mouse move
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
    card.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5 + 18}px 40px rgba(83, 140, 225, 0.22)`;
    card.style.transition = 'box-shadow 0.1s';
  });

  // Reset tilt on mouse leave
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  });

  // Click to highlight text blue (toggle)
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('step-active');
    // Remove active from all cards first
    document.querySelectorAll('.step-card').forEach(c => c.classList.remove('step-active'));
    // Toggle active on clicked card
    if (!isActive) {
      card.classList.add('step-active');
    }
  });

});

// ── Course Search Bar
(function () {
  const searchInput    = document.getElementById('courseSearchInput');
  const clearBtn       = document.getElementById('searchClearBtn');
  const submitBtn      = document.getElementById('searchSubmitBtn');
  const resultsInfo    = document.getElementById('searchResultsInfo');
  const noResults      = document.getElementById('noResults');
  const noResultsQuery = document.getElementById('noResultsQuery');
  const noResultsReset = document.getElementById('noResultsReset');
  const grid           = document.getElementById('coursesGrid');
  const cards          = Array.from(grid.querySelectorAll('.course-card'));

  // Store original title HTML so we can restore highlights
  const originalTitles = cards.map(card => {
    const titleEl = card.querySelector('.c-title');
    return titleEl ? titleEl.innerHTML : '';
  });

  function highlightText(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();

    // Reset all title highlights first
    cards.forEach((card, i) => {
      const titleEl = card.querySelector('.c-title');
      if (titleEl) titleEl.innerHTML = originalTitles[i];
    });

    if (!q) {
      // Show all cards
      cards.forEach(card => card.classList.remove('hidden-card'));
      noResults.style.display = 'none';
      resultsInfo.innerHTML   = '';
      return;
    }

    let visibleCount = 0;

    cards.forEach((card, i) => {
      const cardTitle = (card.dataset.title || '').toLowerCase();
      const cardTag   = (card.dataset.tag || '').toLowerCase();
      const authorEl  = card.querySelector('.name');
      const authorTxt = authorEl ? authorEl.textContent.toLowerCase() : '';

      const matches = cardTitle.includes(q) || cardTag.includes(q) || authorTxt.includes(q);

      if (matches) {
        card.classList.remove('hidden-card');
        visibleCount++;

        // Highlight matching text in title
        const titleEl = card.querySelector('.c-title');
        if (titleEl) {
          titleEl.innerHTML = highlightText(originalTitles[i], query.trim());
        }
      } else {
        card.classList.add('hidden-card');
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display    = 'block';
      noResultsQuery.textContent = query.trim();
      resultsInfo.innerHTML      = '';
    } else {
      noResults.style.display = 'none';
      resultsInfo.innerHTML   = `Showing <span>${visibleCount}</span> result${visibleCount !== 1 ? 's' : ''} for "<span>${query.trim()}</span>"`;
    }
  }

  function clearSearch() {
    searchInput.value = '';
    clearBtn.classList.remove('visible');
    performSearch('');
    searchInput.focus();
  }

  // Show/hide clear button as user types
  searchInput.addEventListener('input', () => {
    const hasValue = searchInput.value.length > 0;
    clearBtn.classList.toggle('visible', hasValue);

    // Live search as user types
    performSearch(searchInput.value);
  });

  // Submit on Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchInput.value);
    }
  });

  // Submit button click
  submitBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });

  // Clear button click
  clearBtn.addEventListener('click', clearSearch);

  // No results reset button
  noResultsReset.addEventListener('click', clearSearch);

})();