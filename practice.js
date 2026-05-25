/**
 * practice.js — Practice mode logic for MedFlash
 */

let queue = [];       // [{ path, disease }, ...]
let currentIndex = 0;
let revealed = false;
let morePanelOpen = false;
let sessionParams = {};


// ── Boot ──────────────────────────────────────────────────────
async function init() {
  const params = new URLSearchParams(location.search);
  sessionParams = {
    scope:   params.get('scope')   || 'all',
    count:   parseInt(params.get('count') || '20', 10),
    shuffle: params.get('shuffle') !== '0',
  };

  await loadManifest();

  let images = getAnnotatedImagesForScope(sessionParams.scope);
  if (sessionParams.shuffle) shuffle(images);
  queue = images.slice(0, sessionParams.count);

  document.getElementById('scope-label').textContent = scopeLabel(sessionParams.scope);

  if (queue.length === 0) {
    showEmpty();
    return;
  }

  showCard(0);
}

// ── Navigation ────────────────────────────────────────────────
function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= queue.length) return;
  showCard(next);
}

function showCard(index) {
  currentIndex = index;
  revealed = false;
  closeModePanel();

  const item = queue[index];

  // Progress
  const total = queue.length;
  const num   = index + 1;
  document.getElementById('progress-label').textContent = `${num} / ${total}`;
  document.getElementById('progress-fill').style.width = `${(num / total) * 100}%`;

  // Buttons
  document.getElementById('btn-prev').disabled = index === 0;
  document.getElementById('btn-next').disabled = index === total - 1;

  // Answer
  const answerEl = document.getElementById('answer-label');
  const hintEl   = document.getElementById('answer-hint');
  answerEl.textContent = item.disease;
  answerEl.classList.add('hidden');
  hintEl.style.display = '';

  const revealBtn = document.getElementById('btn-reveal');
  revealBtn.textContent = 'Reveal';
  revealBtn.classList.remove('revealed');

  // Image
  const img     = document.getElementById('main-img');
  const loading = document.getElementById('img-loading');
  img.style.display = 'none';
  loading.style.display = 'flex';

  img.onload = () => {
    loading.style.display = 'none';
    img.style.display = 'block';
  };
  img.onerror = () => {
    loading.innerHTML = `<span style="color:var(--text-muted);font-size:0.85rem">Image not found</span>`;
  };
  img.src = item.path;
  img.alt = revealed ? item.disease : 'Medical image';
}

// ── Reveal ────────────────────────────────────────────────────
function reveal() {
  if (revealed) {
    navigate(1);
    return;
  }
  revealed = true;

  const item = queue[currentIndex];
  const answerEl = document.getElementById('answer-label');
  const hintEl   = document.getElementById('answer-hint');
  const revealBtn = document.getElementById('btn-reveal');

  answerEl.classList.remove('hidden');
  hintEl.style.display = 'none';

  revealBtn.textContent = 'Next →';
  revealBtn.classList.add('revealed');

  document.getElementById('main-img').alt = item.disease;

  // Show finish screen on last card after reveal
  if (currentIndex === queue.length - 1) {
    setTimeout(() => showFinish(), 800);
  }
}

// ── More images panel ─────────────────────────────────────────
function toggleMorePanel() {
  morePanelOpen ? closeModePanel() : openMorePanel();
}

function openMorePanel() {
  const item    = queue[currentIndex];
  const allImgs = getImagesForDisease(item.disease);
  const grid    = document.getElementById('thumb-grid');
  const panel   = document.getElementById('more-panel');

  document.getElementById('panel-disease-name').textContent = item.disease;

  grid.innerHTML = allImgs.map((src, i) => `
    <div class="thumb${src === item.path ? ' active' : ''}" onclick="jumpToImage('${CSS.escape(src)}')">
      <img src="${src}" alt="${item.disease} image ${i + 1}" loading="lazy" />
    </div>
  `).join('');

  panel.classList.add('open');
  morePanelOpen = true;
}

function closeModePanel() {
  document.getElementById('more-panel').classList.remove('open');
  morePanelOpen = false;
}
// ── Thumb hover preview ───────────────────────────────────────
function showThumbPreview(e, escapedSrc) {
  const preview = document.getElementById('thumb-preview');
  const previewImg = document.getElementById('thumb-preview-img');
  previewImg.src = escapedSrc;
  preview.style.display = 'block';
}

function hideThumbPreview() {
  document.getElementById('thumb-preview').style.display = 'none';
}
function jumpToImage(escapedSrc) {
  // Find the index in queue matching this path
  const src = escapedSrc; // CSS.escape was for the attribute, actual src is unescaped
  // We need to find the actual src — use the thumb img elements
  const thumbs = document.querySelectorAll('#thumb-grid .thumb img');
  let realSrc = null;
  thumbs.forEach(img => {
    if (CSS.escape(img.src.replace(location.origin + '/', '')) === escapedSrc ||
        img.src.replace(location.origin + '/', '') === escapedSrc ||
        img.getAttribute('src') === escapedSrc) {
      realSrc = img.getAttribute('src');
    }
  });
  if (!realSrc) return;

  // Find in queue
  const idx = queue.findIndex(q => q.path === realSrc);
  if (idx !== -1) {
    showCard(idx);
  } else {
    // Not in queue — show it directly without affecting queue position
    const item = queue[currentIndex];
    const imgEl = document.getElementById('main-img');
    const loading = document.getElementById('img-loading');
    loading.style.display = 'flex';
    imgEl.style.display = 'none';
    imgEl.onload = () => { loading.style.display = 'none'; imgEl.style.display = 'block'; };
    imgEl.src = realSrc;
  }
  closeModePanel();
}

// ── Finish screen ─────────────────────────────────────────────
function showFinish() {
  document.getElementById('image-card').style.display = 'none';
  document.getElementById('practice-nav').style.display = 'none';
  const screen = document.getElementById('finish-screen');
  screen.classList.add('show');
  document.getElementById('finish-summary').textContent =
    `You reviewed ${queue.length} image${queue.length !== 1 ? 's' : ''} from ${scopeLabel(sessionParams.scope)}.`;
}

function repeatSession() {
  window.location.href = `practice.html?${new URLSearchParams({
    scope:   sessionParams.scope,
    count:   sessionParams.count,
    shuffle: sessionParams.shuffle ? '1' : '0',
  })}`;
}

function showEmpty() {
  document.getElementById('image-card').innerHTML = `
    <div class="empty-state">
      <i class="ti ti-photo-off" aria-hidden="true"></i>
      <p>No images found for this selection.<br>
         Add images and run <code>scan_images.py</code> to get started.</p>
    </div>`;
  document.getElementById('practice-nav').style.display = 'none';
}

// ── Keyboard shortcuts ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'l') navigate(1);
  else if (e.key === 'ArrowLeft'  || e.key === 'h') navigate(-1);
  else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); reveal(); }
});

init();