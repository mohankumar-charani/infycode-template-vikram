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