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

const transformProjects = (rawResponse) => {
  if (!Array.isArray(rawResponse) || !rawResponse[0]?.projects) {
    return [];
  }

  return rawResponse[0].projects.map((p, idx) => ({
    id: String(p.id),
    name: p.name,
    description: p.descriptions?.[0] || '',
    summary: p.descriptions?.join(' ') || '',
    role: '',
    year: '',
    color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
    technologies: p.technologies?.map(t => t.name) || [],
    responsibilities: p.responsibilities || [],
    images: p.images?.map(img => img.image) || [],
    link: p.link || null,
    videoUrl: p.videoUrl || null,
  }));
};

const transformExperience = (rawResponse) => {
  if (!Array.isArray(rawResponse) || !rawResponse[0]?.experience) {
    return [];
  }

  return rawResponse[0].experience.map((e, idx) => {
    const startYear = parseInt(e.date?.split(' ')[0]) || 2020;
    const endYear = e.date?.includes('Present') ? 2026 : parseInt(e.date?.split('-').pop()?.trim()) || startYear + 1;

    return {
      id: idx,
      company: e.title || '',
      role: e.subtitle || '',
      period: e.date || '',
      startYear,
      endYear,
      location: e.responsibilities?.[e.responsibilities.length - 1] || '',
      type: e.icon === 'SchoolIcon' ? 'Education' : 'Work',
      blurb: '',
      highlights: e.responsibilities || [],
      iconBg: e.iconBackground || '#f9004d',
    };
  });
};

const transformTechnologies = (rawResponse) => {
  if (!Array.isArray(rawResponse) || !rawResponse[0]?.technologies) {
    return [];
  }
  return rawResponse[0].technologies;
};

export const fetchProjects = async () => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${baseUrl}/projects`);
    if (!response.ok) throw new Error('Projects fetch failed');
    const data = await response.json();
    return transformProjects(data);
  } catch (err) {
    console.error('Projects API error:', err);
    return [];
  }
};

export const fetchExperience = async () => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${baseUrl}/experience`);
    if (!response.ok) throw new Error('Experience fetch failed');
    const data = await response.json();
    return transformExperience(data);
  } catch (err) {
    console.error('Experience API error:', err);
    return [];
  }
};

export const fetchTechnologies = async () => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${baseUrl}/technologies`);
    if (!response.ok) throw new Error('Technologies fetch failed');
    const data = await response.json();
    return transformTechnologies(data);
  } catch (err) {
    console.error('Technologies API error:', err);
    return [];
  }
};
