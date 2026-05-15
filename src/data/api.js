const PROJECT_COLORS = [
  'oklch(72% 0.18 35)',
  'oklch(72% 0.18 200)',
  'oklch(72% 0.18 295)',
  'oklch(72% 0.18 145)',
  'oklch(72% 0.18 85)',
  'oklch(72% 0.18 340)',
  'oklch(72% 0.18 50)',
  'oklch(72% 0.18 240)',
];

const baseUrl = () => process.env.REACT_APP_API_URL || '/api';

const transformAbout = (raw) => {
  if (!Array.isArray(raw) || !raw[0]) return null;
  return raw[0];
};

const transformProjects = (raw) => {
  if (!Array.isArray(raw) || !raw[0]?.projects) return [];
  return raw[0].projects.map((p, idx) => ({
    id:               String(p.id),
    name:             p.name,
    year:             p.year ? String(p.year) : '',
    role:             p.role || '',
    description:      p.descriptions?.[0] || '',
    summary:          p.descriptions?.join(' ') || '',
    color:            PROJECT_COLORS[idx % PROJECT_COLORS.length],
    featured:         p.featured ?? false,
    technologies:     p.technologies?.map(t => t.name) || [],
    responsibilities: p.responsibilities || [],
    images:           p.images?.map(img => typeof img === 'string' ? img : img?.image).filter(Boolean) || [],
    imageUrl:         (() => { const imgs = p.images || []; return imgs.length ? (typeof imgs[0] === 'string' ? imgs[0] : imgs[0]?.image) : null; })(),
    link:             p.link || null,
    githubLink:       p.githubLink || null,
    liveLink:         p.liveLink || null,
    videoUrl:         p.videoUrl || null,
  }));
};

const transformExperience = (raw) => {
  if (!Array.isArray(raw) || !raw[0]?.experience) return [];
  return raw[0].experience.map((e, idx) => {
    const startYear = parseInt(e.date?.split(' ')[0]) || 2020;
    const endYear   = e.date?.includes('Present')
      ? new Date().getFullYear()
      : parseInt(e.date?.split('-').pop()?.trim()) || startYear + 1;
    return {
      id:         idx,
      company:    e.title || '',
      role:       e.subtitle || '',
      period:     e.date || '',
      startYear,
      endYear,
      location:   e.responsibilities?.[e.responsibilities.length - 1] || '',
      type:       e.icon === 'SchoolIcon' ? 'Education' : 'Work',
      blurb:      '',
      highlights: e.responsibilities || [],
      iconBg:     e.iconBackground || '#f9004d',
    };
  });
};

// Returns [{name, category, packages}] — category ∈ engines|languages|web|xr3d|tools
const transformTechnologies = (raw) => {
  if (!Array.isArray(raw) || !raw[0]?.technologies) return [];
  return raw[0].technologies.map(t =>
    typeof t === 'string'
      ? { name: t, category: 'tools', packages: [] }
      : { name: t.name || '', category: t.category || 'tools', packages: t.packages || [] }
  ).filter(t => t.name);
};

const apiFetch = async (endpoint, transform, label) => {
  try {
    const res = await fetch(`${baseUrl()}/${endpoint}`);
    if (!res.ok) throw new Error(`${label} fetch failed (${res.status})`);
    return transform(await res.json());
  } catch (err) {
    console.error(`${label} API error:`, err);
    return transform([]);
  }
};

export const fetchAbout        = () => apiFetch('about',        transformAbout,        'About');
export const fetchProjects     = () => apiFetch('projects',     transformProjects,     'Projects');
export const fetchExperience   = () => apiFetch('experience',   transformExperience,   'Experience');
export const fetchTechnologies = () => apiFetch('technologies', transformTechnologies, 'Technologies');

// ── Categories metadata ─────────────────────────────────────────────────────
const transformCategories = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { colors: {}, labels: {}, order: [] };
  return raw;
};
export const fetchCategories = () => apiFetch('categories', transformCategories, 'Categories');

// ── Tech Stack Graph ────────────────────────────────────────────────────────
export const fetchTechStack = () => apiFetch('tech-stack', r => r, 'TechStack');

// ── Skills ──────────────────────────────────────────────────────────────────
export const fetchSkills = () => apiFetch('skills', r => r, 'Skills');

// ── New: Blog ────────────────────────────────────────────────────────────────
const transformBlog = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map(post => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    featuredImage: post.featuredImage || null,
    tags: post.tags || [],
    published: post.published ?? true,
    publishDate: post.publishDate || null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));
};

export const fetchBlogPosts   = (published) =>
  apiFetch(`blog${published === false ? '?published=false' : ''}`, transformBlog, 'Blog');
export const fetchBlogPost    = (slug) =>
  apiFetch(`blog/${slug}`, r => Array.isArray(r) ? transformBlog(r)[0] : r, 'Blog');

// ── New: Plugins / Packages ─────────────────────────────────────────────────
const transformPlugins = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map(p => ({
    id: p._id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    storeType: p.storeType || 'unity',
    unityStoreUrl: p.unityStoreUrl || null,
    unrealStoreUrl: p.unrealStoreUrl || null,
    images: (p.images || []).map(img => typeof img === 'string' ? { url: img, alt: p.name } : img),
    icon: p.icon || null,
    price: p.price || null,
    version: p.version || '1.0.0',
    technologies: p.technologies || [],
    featured: p.featured ?? false,
  }));
};

export const fetchPlugins     = (featuredOnly) =>
  apiFetch(`plugins${featuredOnly ? '?featured=true' : ''}`, transformPlugins, 'Plugins');
export const fetchPlugin      = (slug) =>
  apiFetch(`plugins/${slug}`, r => Array.isArray(r) ? transformPlugins(r)[0] : r, 'Plugin');

// ── New: Apps ────────────────────────────────────────────────────────────────
const transformApps = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map(a => ({
    id: a._id,
    name: a.name,
    slug: a.slug,
    description: a.description || '',
    platform: a.platform || 'android',
    appStoreUrl: a.appStoreUrl || null,
    googlePlayUrl: a.googlePlayUrl || null,
    images: (a.images || []).map(img => typeof img === 'string' ? { url: img, alt: a.name } : img),
    icon: a.icon || null,
    downloads: a.downloads || 0,
    rating: a.rating || 0,
    featured: a.featured ?? false,
  }));
};

export const fetchApps        = (filters) =>
  apiFetch(`apps${filters ? `?${new URLSearchParams(filters)}` : ''}`, transformApps, 'Apps');
export const fetchApp         = (slug) =>
  apiFetch(`apps/${slug}`, r => Array.isArray(r) ? transformApps(r)[0] : r, 'App');

// ── Homelab ──────────────────────────────────────────────────────────────────
const transformHomelab = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map(s => ({
    id:          s._id?.toString() || String(Math.random()),
    name:        s.name        || '',
    slug:        s.slug        || '',
    subdomain:   s.subdomain   || '',
    isPublic:    s.isPublic    !== false,
    url:         s.url         || null,
    localUrl:    s.localUrl    || null,
    icon:        s.icon        || '🖥',
    color:       s.color       || '#888888',
    status:      s.status      || 'online',
    description: s.description || '',
    category:    s.category    || 'Infrastructure',
    images:      s.images      || [],
    learned:     s.learned     || [],
    tags:        s.tags        || [],
    uptime:      s.uptime      || null,
    since:       s.since       || null,
    order:       s.order       || 0,
    featured:    s.featured    || false,
  }));
};

export const fetchHomelab = () => apiFetch('homelab', transformHomelab, 'Homelab');

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res = await fetch(`${baseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Login failed (${res.status})`);
  }
  return await res.json();
};

export const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${baseUrl()}/${endpoint}`, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('auth_token');
      throw new Error('Unauthorized');
    }
    return await res.json();
  } catch (err) {
    console.error(`Auth fetch error (${endpoint}):`, err);
    throw err;
  }
};

// ── CRUD helpers for dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  // About
  updateAbout: (id, data) => authFetch(`about/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  // Projects
  createProject: (data) => authFetch('projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updateProject: (id, data) => authFetch(`projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deleteProject: (id) => authFetch(`projects/${id}`, { method: 'DELETE' }),

  // Experience
  createExperience: (data) => authFetch('experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updateExperience: (index, data) => authFetch(`experience/${index}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deleteExperience: (index) => authFetch(`experience/${index}`, { method: 'DELETE' }),

  // Technologies
  createTechnology: (data) => authFetch('technologies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updateTechnology: (index, data) => authFetch(`technologies/${index}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deleteTechnology: (index) => authFetch(`technologies/${index}`, { method: 'DELETE' }),

  // Blog
  createBlogPost: (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch('blog', { method: 'POST', body: fd });
  },
  updateBlogPost: (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch(`blog/${id}`, { method: 'PUT', body: fd });
  },
  deleteBlogPost: (id) => authFetch(`blog/${id}`, { method: 'DELETE' }),

  // Plugins
  createPlugin: (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch('plugins', { method: 'POST', body: fd });
  },
  updatePlugin: (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch(`plugins/${id}`, { method: 'PUT', body: fd });
  },
  deletePlugin: (id) => authFetch(`plugins/${id}`, { method: 'DELETE' }),

  // Apps
  createApp: (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch('apps', { method: 'POST', body: fd });
  },
  updateApp: (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    return authFetch(`apps/${id}`, { method: 'PUT', body: fd });
  },
  deleteApp: (id) => authFetch(`apps/${id}`, { method: 'DELETE' }),

  // Homelab
  createHomelabService: (data) => authFetch('homelab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updateHomelabService: (id, data) => authFetch(`homelab/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deleteHomelabService: (id) => authFetch(`homelab/${id}`, { method: 'DELETE' }),
};
