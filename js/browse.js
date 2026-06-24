/* browse.js — Browse page logic */

let currentDisease = null;
let lightboxImages  = [];
let lightboxIndex   = 0;

async function init() {
  await loadManifest();
  buildSidebar();
  showDisease(null);

  const params = new URLSearchParams(location.search);
  const d = params.get('disease');
  if (d) selectDisease(d);

  document.getElementById('sidebar-search').addEventListener('input', filterSidebar);
}

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'sidebar-item active';
  allBtn.id = 'nav-all';
  const total = Object.values(MANIFEST).reduce((s, v) => s + v.length, 0);
  allBtn.innerHTML = `<span>All images</span><span class="count">${total}</span>`;
  allBtn.onclick = () => selectDisease(null);
  nav.appendChild(allBtn);

  for (const system of CATALOG) {
    const section = document.createElement('div');
    section.className = 'sidebar-section';
    section.dataset.systemId = system.id;

    const systemTotal = system.groups.flatMap(g => g.diseases).reduce((n, d) => n + getImagesForDisease(d).length, 0);

    const header = document.createElement('div');
    header.className = 'sidebar-section-label sidebar-section-toggle';
    header.style.cursor = 'pointer';
    header.style.userSelect = 'none';
    header.innerHTML = `
      <i class="ti ${system.icon}" aria-hidden="true" style="color:#57748f"></i>
      <span style="flex:1;color:#57748f;font-weight:600">${system.label}</span>
      <span class="count" style="font-size:0.7rem;color:var(--text-muted)">${systemTotal}</span>
      <i class="ti ti-chevron-right toggle-chevron" style="font-size:0.75rem;transition:transform 0.2s;margin-left:4px"></i>
    `;

    const body = document.createElement('div');
    body.className = 'sidebar-section-body';
    body.style.display = 'none';

    header.onclick = () => {
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      header.querySelector('.toggle-chevron').style.transform = open ? '' : 'rotate(90deg)';
    };

    for (const group of system.groups) {
      for (const disease of group.diseases) {
        const imgs = getImagesForDisease(disease);
        const btn = document.createElement('button');
        btn.className = 'sidebar-item' + (imgs.length === 0 ? ' no-images' : '');
        btn.dataset.disease = disease;
        btn.innerHTML = `<span class="disease-name">${disease}</span><span class="count">${imgs.length || ''}</span>`;
        if (imgs.length > 0) btn.onclick = () => selectDisease(disease);
        body.appendChild(btn);
      }
    }

    section.appendChild(header);
    section.appendChild(body);
    nav.appendChild(section);
  }
}

function filterSidebar(e) {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#sidebar-nav .sidebar-section').forEach(sec => {
    const body = sec.querySelector('.sidebar-section-body');
    const header = sec.querySelector('.sidebar-section-toggle');
    let anyVisible = false;
    sec.querySelectorAll('.sidebar-item[data-disease]').forEach(btn => {
      const name = (btn.dataset.disease || '').toLowerCase();
      const hide = q && !name.includes(q);
      btn.style.display = hide ? 'none' : '';
      if (!hide) anyVisible = true;
    });
    sec.style.display = anyVisible || !q ? '' : 'none';
    if (q && body) {
      body.style.display = anyVisible ? '' : 'none';
      if (header) header.querySelector('.toggle-chevron').style.transform = anyVisible ? 'rotate(90deg)' : '';
    }
  });
}

function selectDisease(disease) {
  currentDisease = disease;

  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  if (disease === null) {
    document.getElementById('nav-all').classList.add('active');
  } else {
    const btn = document.querySelector(`.sidebar-item[data-disease="${CSS.escape(disease)}"]`);
    if (btn) btn.classList.add('active');
  }

  showDisease(disease);
  history.replaceState(null, '', disease ? `?disease=${encodeURIComponent(disease)}` : '?');
}

function showDisease(disease) {
  const container = document.getElementById('image-grid-container');
  const titleEl   = document.getElementById('browse-title');
  const countEl   = document.getElementById('browse-count');

  let images;
  if (disease === null) {
    images = [];
    for (const [d, paths] of Object.entries(MANIFEST)) {
      for (const p of paths) images.push({ path: p, disease: d });
    }
    titleEl.textContent = 'All images';
  } else {
    images = getImagesForDisease(disease).map(p => ({ path: p, disease }));
    titleEl.textContent = disease;
  }

  countEl.textContent = `${images.length} image${images.length !== 1 ? 's' : ''}`;
  lightboxImages = images;

  if (images.length === 0) {
    container.innerHTML = `<div class="browse-empty">
      <i class="ti ti-photo-off" aria-hidden="true"></i>
      <p>No images found.<br>Add images and run <code>scan_images.py</code>.</p>
    </div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'image-grid';

  images.forEach(({ path, disease: d }, i) => {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.onclick = () => openLightbox(i);
    item.innerHTML = `
      <img src="${path}" alt="${d}" loading="lazy" />
      ${currentDisease === null ? `<div class="grid-item-label">${d}</div>` : ''}
    `;
    grid.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(grid);
}

function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function lightboxNav(dir) {
  lightboxIndex = Math.max(0, Math.min(lightboxImages.length - 1, lightboxIndex + dir));
  renderLightbox();
}

function renderLightbox() {
  const { path, disease } = lightboxImages[lightboxIndex];
  document.getElementById('lightbox-img').src = path;
  document.getElementById('lightbox-img').alt = disease;
  document.getElementById('lightbox-label').textContent = disease;
}

function practiceCurrentView() {
  const scope = currentDisease ? `disease:${currentDisease}` : 'all';
  const images = currentDisease ? getImagesForDisease(currentDisease) : Object.values(MANIFEST).flat();
  document.getElementById('browse-modal-subtitle').textContent = currentDisease || 'All images';
  document.getElementById('browse-image-count').value = Math.min(20, images.length);
  document.getElementById('browse-image-count').max = images.length;
  document.getElementById('browse-images-available').textContent =
    images.length > 0 ? `${images.length} images available` : 'No images found.';
  document.getElementById('browse-modal').dataset.scope = scope;
  document.getElementById('browse-modal').classList.add('open');
  document.getElementById('browse-image-count').focus();
}

function closeBrowseModal() {
  document.getElementById('browse-modal').classList.remove('open');
}

function startBrowsePractice() {
  const count = parseInt(document.getElementById('browse-image-count').value, 10);
  const shuffle = document.getElementById('browse-shuffle-toggle').value === 'shuffle';
  if (!count || count < 1) return;
  const scope = document.getElementById('browse-modal').dataset.scope;
  const params = new URLSearchParams({ scope, count, shuffle: shuffle ? '1' : '0' });
  window.location.href = `practice.html?${params}`;
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  const modal = document.getElementById('browse-modal');

  if (e.key === 'Escape') {
    if (lb.classList.contains('open')) {
      closeLightbox();
    } else if (modal.classList.contains('open')) {
      closeBrowseModal();
    }
    return;
  }

  if (lb.classList.contains('open')) {
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
  }
});

document.getElementById('browse-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeBrowseModal();
});

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLightbox();
});

init();
