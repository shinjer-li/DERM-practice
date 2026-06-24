/* app.js — Shared utilities */

let MANIFEST = {};
let MANIFEST_LOADED = false;

async function loadManifest() {
  try {
    const res = await fetch('image-manifest.json');
    if (!res.ok) throw new Error('manifest not found');
    MANIFEST = await res.json();
  } catch (e) {
    console.warn('image-manifest.json not found. Run scan_images.py to generate it.', e);
    MANIFEST = {};
  }
  MANIFEST_LOADED = true;
}

function getImagesForDisease(diseaseName) {
  if (!diseaseName) return [];
  if (MANIFEST[diseaseName]) return MANIFEST[diseaseName];
  const lower = diseaseName.toLowerCase();
  for (const key of Object.keys(MANIFEST)) {
    if (key.toLowerCase() === lower) return MANIFEST[key];
  }
  return [];
}

function getImagesForScope(scope) {
  if (scope === 'all') return Object.values(MANIFEST).flat();

  if (scope.startsWith('disease:')) {
    return getImagesForDisease(scope.replace('disease:', ''));
  }

  const system = CATALOG.find(s => s.id === scope);
  if (!system) return [];
  return system.groups.flatMap(g => g.diseases.flatMap(d => getImagesForDisease(d)));
}

function getAnnotatedImagesForScope(scope) {
  if (scope.startsWith('group:')) return getAnnotatedImagesForGroupScope(scope);
  if (scope.startsWith('multi:')) return getAnnotatedImagesForMultiScope(scope);

  if (scope === 'all') {
    return Object.entries(MANIFEST).flatMap(([disease, paths]) =>
      paths.map(path => ({ path, disease }))
    );
  }

  if (scope.startsWith('disease:')) {
    const name = scope.replace('disease:', '');
    return getImagesForDisease(name).map(p => ({ path: p, disease: name }));
  }

  const system = CATALOG.find(s => s.id === scope);
  if (!system) return [];
  return system.groups.flatMap(g =>
    g.diseases.flatMap(d =>
      getImagesForDisease(d).map(p => ({ path: p, disease: d }))
    )
  );
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scopeLabel(scope) {
  if (scope === 'all') return 'Return Home';
  if (scope.startsWith('disease:')) return scope.replace('disease:', '');
  if (scope.startsWith('group:')) {
    const parts = scope.split(':');
    return decodeURIComponent(parts.slice(2).join(':'));
  }
  if (scope.startsWith('multi:')) {
    const diseases = scope.replace('multi:', '').split('|||');
    return diseases.slice(0, 2).join(', ') + (diseases.length > 2 ? ` +${diseases.length - 2}` : '');
  }
  const sys = CATALOG.find(s => s.id === scope);
  return sys ? sys.label : scope;
}

function getImagesForGroupScope(scope) {
  const parts = scope.split(':');
  const systemId = parts[1];
  const groupLabel = decodeURIComponent(parts.slice(2).join(':'));
  const system = CATALOG.find(s => s.id === systemId);
  if (!system) return [];
  const group = system.groups.find(g => g.label === groupLabel);
  if (!group) return [];
  return group.diseases.flatMap(d => getImagesForDisease(d));
}

function getAnnotatedImagesForGroupScope(scope) {
  const parts = scope.split(':');
  const systemId = parts[1];
  const groupLabel = decodeURIComponent(parts.slice(2).join(':'));
  const system = CATALOG.find(s => s.id === systemId);
  if (!system) return [];
  const group = system.groups.find(g => g.label === groupLabel);
  if (!group) return [];
  return group.diseases.flatMap(d =>
    getImagesForDisease(d).map(p => ({ path: p, disease: d }))
  );
}

function getImagesForMultiScope(scope) {
  return scope.replace('multi:', '').split('|||').flatMap(d => getImagesForDisease(d));
}

function getAnnotatedImagesForMultiScope(scope) {
  return scope.replace('multi:', '').split('|||').flatMap(d =>
    getImagesForDisease(d).map(p => ({ path: p, disease: d }))
  );
}
