/**
 * app.js — Shared utilities for MedFlash
 * Loads image-manifest.json and exposes helper functions.
 */

let MANIFEST = {};  // { "DiseaseName": ["images/path/img.jpg", ...] }
let MANIFEST_LOADED = false;

/**
 * Load the image manifest from image-manifest.json.
 * Call this once before using any image-lookup helpers.
 */
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

/**
 * Return all images for a specific disease name.
 * The disease name is matched case-insensitively to manifest keys.
 */
function getImagesForDisease(diseaseName) {
  if (!diseaseName) return [];
  // Exact match first
  if (MANIFEST[diseaseName]) return MANIFEST[diseaseName];
  // Case-insensitive fallback
  const lower = diseaseName.toLowerCase();
  for (const key of Object.keys(MANIFEST)) {
    if (key.toLowerCase() === lower) return MANIFEST[key];
  }
  return [];
}

/**
 * Return all images for a given scope string:
 *   'all'            – every image in the manifest
 *   'system-id'      – all diseases under that system in the catalog
 *   'disease:Name'   – just that disease
 */
function getImagesForScope(scope) {
  if (scope === 'all') {
    return Object.values(MANIFEST).flat();
  }

  if (scope.startsWith('disease:')) {
    const name = scope.replace('disease:', '');
    return getImagesForDisease(name);
  }

  // Look up by system id
  const system = CATALOG.find(s => s.id === scope);
  if (!system) return [];

  const imgs = [];
  for (const group of system.groups) {
    for (const disease of group.diseases) {
      imgs.push(...getImagesForDisease(disease));
    }
  }
  return imgs;
}

/**
 * Return annotated images: [{ path, disease }, ...]
 * for a given scope.
 */
function getAnnotatedImagesForScope(scope) {
  if (scope.startsWith('group:')) return getAnnotatedImagesForGroupScope(scope);
  if (scope.startsWith('multi:')) return getAnnotatedImagesForMultiScope(scope);

  if (scope === 'all') {
    const results = [];
    for (const [disease, paths] of Object.entries(MANIFEST)) {
      for (const path of paths) results.push({ path, disease });
    }
    return results;
  }

  if (scope.startsWith('disease:')) {
    const name = scope.replace('disease:', '');
    return getImagesForDisease(name).map(p => ({ path: p, disease: name }));
  }

  const system = CATALOG.find(s => s.id === scope);
  if (!system) return [];
  const results = [];
  for (const group of system.groups) {
    for (const disease of group.diseases) {
      for (const path of getImagesForDisease(disease)) {
        results.push({ path, disease });
      }
    }
  }
  return results;
}
/**
 * Shuffle an array in-place (Fisher-Yates).
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Derive a human-readable label for a scope string.
 */
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

/**
 * Get images for a group scope: 'group:systemId:groupLabel'
 */
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

/**
 * Get annotated images for group scope
 */
function getAnnotatedImagesForGroupScope(scope) {
  const parts = scope.split(':');
  const systemId = parts[1];
  const groupLabel = decodeURIComponent(parts.slice(2).join(':'));
  const system = CATALOG.find(s => s.id === systemId);
  if (!system) return [];
  const group = system.groups.find(g => g.label === groupLabel);
  if (!group) return [];
  return group.diseases.flatMap(d => getImagesForDisease(d).map(p => ({ path: p, disease: d })));
}

/**
 * Get images for multi scope: 'multi:Disease1|||Disease2'
 */
function getImagesForMultiScope(scope) {
  const diseases = scope.replace('multi:', '').split('|||');
  return diseases.flatMap(d => getImagesForDisease(d));
}

/**
 * Get annotated images for multi scope
 */
function getAnnotatedImagesForMultiScope(scope) {
  const diseases = scope.replace('multi:', '').split('|||');
  return diseases.flatMap(d => getImagesForDisease(d).map(p => ({ path: p, disease: d })));
}