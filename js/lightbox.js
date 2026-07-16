// Gallery filter + lightbox
document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

  // ── Filtering ──
  function applyFilter(category) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === category));
    document.querySelectorAll('.gallery-section').forEach(section => {
      const show = category === 'all' || section.dataset.category === category;
      section.style.display = show ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
      history.replaceState(null, '', btn.dataset.filter === 'all' ? 'gallery.html' : `#${btn.dataset.filter}`);
    });
  });

  const initial = window.location.hash.replace('#', '');
  if (initial && filterBtns.some(b => b.dataset.filter === initial)) {
    applyFilter(initial);
  }

  // ── Lightbox ──
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbCounter = document.getElementById('lightbox-counter');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = items[currentIndex];
    const fullSrc = item.dataset.full || item.querySelector('img').src;
    lbImg.src = fullSrc;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.querySelector('img').alt;
    lbCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function next() { currentIndex = (currentIndex + 1) % items.length; updateLightbox(); }
  function prev() { currentIndex = (currentIndex - 1 + items.length) % items.length; updateLightbox(); }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', next);
  document.getElementById('lightbox-prev').addEventListener('click', prev);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
});
