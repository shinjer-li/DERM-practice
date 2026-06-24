/* home.js — Index page logic */

let currentScope = 'all';
let selectedDiseases = new Set();

async function init() {
  await loadManifest();
  renderSystems();
}

function renderSystems() {
  const container = document.getElementById('systems-container');
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'systems-grid';

  for (const system of CATALOG) {
    grid.appendChild(buildSystemCard(system));
  }

  container.appendChild(grid);

  const bar = document.createElement('div');
  bar.id = 'multiselect-bar';
  bar.innerHTML = `
    <span id="multiselect-count" style="font-size:0.85rem;color:var(--text-secondary)">0 selected</span>
    <button class="btn btn-sm" onclick="clearMultiSelect()">Clear</button>
    <button class="btn btn-sm btn-primary" onclick="practiceMultiSelect()">
      <i class="ti ti-player-play"></i> Practice selected
    </button>
  `;
  document.body.appendChild(bar);
}

function toggleDisease(disease) {
  if (selectedDiseases.has(disease)) {
    selectedDiseases.delete(disease);
  } else {
    selectedDiseases.add(disease);
  }
  updateMultiSelectUI();
}

function buildSystemCard(system) {
  const card = document.createElement('div');
  card.className = 'system-card';
  card.dataset.systemId = system.id;
  const totalImages = countSystemImages(system);

  card.innerHTML = `
    <div class="system-header">
      <div class="system-header-left">
        <input type="checkbox" class="system-checkbox" data-system="${system.id}"
          onclick="event.stopPropagation(); toggleSystem('${system.id}')"
          title="Select all in ${system.label}" />
        <div class="system-icon"><i class="ti ${system.icon}" aria-hidden="true"></i></div>
        <div>
          <div class="system-title">${system.label}</div>
          <div class="system-meta">${totalImages} image${totalImages !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>
    <div class="system-body">
      ${system.groups.map(g => buildGroup(g, system)).join('')}
    </div>
  `;
  return card;
}

function buildGroup(group, system) {
  const groupImages = group.diseases.reduce((n, d) => n + getImagesForDisease(d).length, 0);
  const hasImages = groupImages > 0;

  const chips = group.diseases.map(d => {
    const imgs = getImagesForDisease(d);
    const hasImg = imgs.length > 0;
    const count = hasImg ? ` <span style="color:var(--text-muted);font-size:0.72rem">${imgs.length}</span>` : '';
    const isSelected = selectedDiseases.has(d);
    return `<button class="disease-chip${hasImg ? '' : ' no-images'}${isSelected ? ' selected' : ''}"
      ${hasImg ? `onclick="handleChipClick(event, '${escAttr(d)}')"` : ''}
    title="${hasImg ? `${imgs.length} image${imgs.length !== 1 ? 's' : ''}` : 'No images loaded'}"
      >${d}${count}</button>`;
  }).join('');

  return `
    <div class="group-block">
      <div class="group-label" style="display:flex;align-items:center;gap:7px;">
        ${hasImages ? `<input type="checkbox" class="group-checkbox"
          data-system="${escAttr(system.id)}" data-group="${escAttr(group.label)}"
          onclick="event.stopPropagation(); toggleGroup('${escAttr(system.id)}','${escAttr(group.label)}')"
          title="Select all in ${escAttr(group.label)}" />` : `<span style="width:16px;flex-shrink:0;display:inline-block"></span>`}
        <span class="group-label-text">${group.label}</span>
        <span style="margin-left:auto;font-size:0.7rem;color:var(--text-muted)">${groupImages}</span>
      </div>
      <div class="disease-chips">${chips}</div>
    </div>
  `;
}

function handleChipClick(e, disease) {
  e.preventDefault();
  toggleDisease(disease);
}

function toggleGroup(systemId, groupLabel) {
  const sys = CATALOG.find(s => s.id === systemId);
  if (!sys) return;
  const group = sys.groups.find(g => g.label === groupLabel);
  if (!group) return;
  const diseases = group.diseases.filter(d => getImagesForDisease(d).length > 0);
  const anySelected = diseases.some(d => selectedDiseases.has(d));
  diseases.forEach(d => anySelected ? selectedDiseases.delete(d) : selectedDiseases.add(d));
  updateMultiSelectUI();
}

function toggleSystem(systemId) {
  const sys = CATALOG.find(s => s.id === systemId);
  if (!sys) return;
  const diseases = sys.groups.flatMap(g => g.diseases).filter(d => getImagesForDisease(d).length > 0);
  const anySelected = diseases.some(d => selectedDiseases.has(d));
  diseases.forEach(d => anySelected ? selectedDiseases.delete(d) : selectedDiseases.add(d));
  updateMultiSelectUI();
}

function updateMultiSelectUI() {
  const bar = document.getElementById('multiselect-bar');
  if (!bar) return;
  if (selectedDiseases.size > 0) {
    bar.style.display = 'flex';
    document.getElementById('multiselect-count').textContent =
      `${selectedDiseases.size} patholog${selectedDiseases.size === 1 ? 'y' : 'ies'} selected`;
  } else {
    bar.style.display = 'none';
  }

  document.querySelectorAll('.disease-chip').forEach(chip => {
    const name = chip.textContent.replace(/\s*\d+\s*$/, '').trim();
    chip.classList.toggle('selected', selectedDiseases.has(name));
  });

  document.querySelectorAll('.group-checkbox').forEach(cb => {
    const systemId = cb.dataset.system;
    const groupLabel = cb.dataset.group;
    const sys = CATALOG.find(s => s.id === systemId);
    if (!sys) return;
    const group = sys.groups.find(g => g.label === groupLabel);
    if (!group) return;
    const withImages = group.diseases.filter(d => getImagesForDisease(d).length > 0);
    const selectedCount = withImages.filter(d => selectedDiseases.has(d)).length;
    cb.checked = selectedCount === withImages.length && withImages.length > 0;
    cb.indeterminate = selectedCount > 0 && selectedCount < withImages.length;
  });

  document.querySelectorAll('.system-checkbox').forEach(cb => {
    const systemId = cb.dataset.system;
    const sys = CATALOG.find(s => s.id === systemId);
    if (!sys) return;
    const withImages = sys.groups.flatMap(g => g.diseases).filter(d => getImagesForDisease(d).length > 0);
    const selectedCount = withImages.filter(d => selectedDiseases.has(d)).length;
    cb.checked = selectedCount === withImages.length && withImages.length > 0;
    cb.indeterminate = selectedCount > 0 && selectedCount < withImages.length;
  });
}

function clearMultiSelect() {
  selectedDiseases.clear();
  updateMultiSelectUI();
}

function practiceMultiSelect() {
  if (selectedDiseases.size === 0) return;
  const scope = 'multi:' + [...selectedDiseases].join('|||');
  openPracticeModal(scope);
}

function countSystemImages(system) {
  let n = 0;
  for (const g of system.groups) {
    for (const d of g.diseases) n += getImagesForDisease(d).length;
  }
  return n;
}

function openPracticeModal(scope) {
  currentScope = scope;
  let images;
  if (scope.startsWith('multi:')) {
    images = getImagesForMultiScope(scope);
  } else if (scope.startsWith('group:')) {
    images = getImagesForGroupScope(scope);
  } else {
    images = getImagesForScope(scope);
  }

  let subtitle = 'All systems';
  if (scope === 'all') subtitle = 'All systems';
  else if (scope.startsWith('disease:')) subtitle = scope.replace('disease:', '');
  else if (scope.startsWith('group:')) {
    const parts = scope.split(':');
    subtitle = decodeURIComponent(parts[2] || scope);
  } else if (scope.startsWith('multi:')) {
    const diseases = scope.replace('multi:', '').split('|||');
    subtitle = diseases.slice(0, 2).join(', ') + (diseases.length > 2 ? ` +${diseases.length - 2} more` : '');
  } else {
    const sys = CATALOG.find(s => s.id === scope);
    if (sys) subtitle = sys.label;
  }

  document.getElementById('modal-subtitle').textContent = subtitle;
  document.getElementById('image-count').value = Math.min(20, images.length);
  document.getElementById('image-count').max = images.length;
  document.getElementById('images-available').textContent =
    images.length > 0 ? `${images.length} images available` : 'No images found for this selection.';

  document.getElementById('practice-modal').classList.add('open');
  document.getElementById('image-count').focus();
}

function closeModal() {
  document.getElementById('practice-modal').classList.remove('open');
}

document.getElementById('practice-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function startPractice() {
  const count = parseInt(document.getElementById('image-count').value, 10);
  const shuffle = document.getElementById('shuffle-toggle').value === 'shuffle';
  if (!count || count < 1) return;
  const params = new URLSearchParams({ scope: currentScope, count, shuffle: shuffle ? '1' : '0' });
  window.location.href = `practice.html?${params}`;
}

function escAttr(s) {
  return s.replace(/'/g, "\\'");
}

init();
