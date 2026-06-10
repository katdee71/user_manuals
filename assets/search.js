// Loads manuals.json and drives search + category filtering.
// Category colours: add new categories here and in index.html chips.
const CAT_COLORS = {
  camera:      { bg: '#E6F1FB', icon: '#185FA5', pill: '#B5D4F4', pillText: '#0C447C' },
  audio:       { bg: '#EEEDFE', icon: '#534AB7', pill: '#CECBF6', pillText: '#3C3489' },
  appliance:   { bg: '#FAECE7', icon: '#993C1D', pill: '#F5C4B3', pillText: '#712B13' },
  electronics: { bg: '#EAF3DE', icon: '#3B6D11', pill: '#C0DD97', pillText: '#27500A' },
  vehicle:     { bg: '#FAEEDA', icon: '#854F0B', pill: '#FAC775', pillText: '#633806' },
  default:     { bg: '#F1EFE8', icon: '#5F5E5A', pill: '#D3D1C7', pillText: '#444441' },
};

// SVG icons keyed by category
const ICONS = {
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  audio:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  appliance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  electronics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
  vehicle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
};

let allManuals = [];
let activeFilter = 'all';

async function init() {
  try {
    const res = await fetch('manuals.json');
    allManuals = await res.json();
  } catch (e) {
    // Fall back to demo data if manuals.json not found yet
    allManuals = [
      { brand:'Canon', model:'AE-1 35mm SLR', year:1976, category:'camera', size:'4.2 MB', slug:'canon-ae1-1976' },
      { brand:'Sony', model:'TC-630 Reel-to-Reel', year:1971, category:'audio', size:'6.8 MB', slug:'sony-tc630-1971' },
    ];
  }
  render();
}

function render() {
  const q = document.getElementById('search').value.toLowerCase().trim();
  const filtered = allManuals.filter(m => {
    const catMatch = activeFilter === 'all' || m.category.split(" ").includes(activeFilter);
    const qMatch = !q || [m.brand, m.model, m.category, String(m.year)].join(' ').toLowerCase().includes(q);
    return catMatch && qMatch;
  });

  document.getElementById('stats').textContent =
    `Showing ${filtered.length} of ${allManuals.length} manual${allManuals.length !== 1 ? 's' : ''}`;

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;color:var(--hint);font-size:14px;padding:2rem 0;">No manuals found. Try a different search or filter.</p>';
    return;
  }

  filtered.forEach(m => {
    const c = CAT_COLORS[m.category] || CAT_COLORS.default;
    const icon = ICONS[m.category] || ICONS.default;
    const a = document.createElement('a');
    a.href = `manuals/${m.slug}/`;
    a.className = 'card';
    a.innerHTML = `
      <div class="card-thumb" style="background:${c.bg}">
        <div class="card-thumb-icon" style="color:${c.icon}">${icon}</div>
        <span class="card-year" style="background:${c.pill};color:${c.pillText}">${m.year}</span>
      </div>
      <div class="card-body">
        <div class="card-brand">${m.brand}</div>
        <div class="card-model">${m.model}</div>
        <div class="card-meta">
          <span class="cat-pill" style="background:${c.pill};color:${c.pillText}">${m.category}</span>
          <span>${m.size}</span>
        </div>
      </div>`;
    grid.appendChild(a);
  });
}

// Wire up search and chips
document.getElementById('search').addEventListener('input', render);

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

init();
