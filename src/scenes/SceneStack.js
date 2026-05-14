import { useState, useEffect } from 'react';
import './SceneStack.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchTechnologies } from '../data/api';

const PACKAGES_MAP = {
  'Unity': [
    'New Input System', 'Cinemachine', 'FMOD Studio', 'DOTween', 'UniTask',
    'Addressables', 'Netcode for GameObjects', 'Mirror Networking', 'ProBuilder',
    'Shader Graph', 'VFX Graph', 'TextMeshPro', 'Timeline', 'Universal RP (URP)',
    'High Definition RP (HDRP)', 'Odin Inspector', 'A* Pathfinding Project',
    'Zenject', 'PlayFab', 'Steamworks.NET', 'Spine 2D', 'LeanTween',
  ],
  'Unreal Engine': [
    'Gameplay Ability System (GAS)', 'Enhanced Input System', 'FMOD Studio',
    'Common UI', 'Niagara VFX', 'MetaSound', 'Motion Warping', 'Control Rig',
    'IK Rig', 'Full Body IK', 'Online Subsystem Steam', 'Wwise',
    'Mass Entity (ECS)', 'PCG Framework', 'Chaos Vehicles', 'Water System',
    'Lyra Game Framework', 'GameplayTags',
  ],
  'Custom engines': [
    'SDL2', 'SFML', 'OpenGL', 'Vulkan', 'DirectX 12', 'FMOD Core',
    'PhysX', 'Bullet Physics', 'EnTT (ECS)', 'flecs (ECS)',
  ],
  'C#': [
    'LINQ', 'async/await & Task Parallel Library', 'Roslyn Analyzers',
    'NUnit', 'xUnit', 'Moq', 'BenchmarkDotNet', 'Newtonsoft.Json',
    'System.Text.Json', 'AutoMapper', 'Dapper',
  ],
  'C++': [
    'STL', 'Boost', 'EASTL', 'CMake', 'vcpkg', 'Conan',
    'Catch2', 'Google Test', 'spdlog', 'nlohmann/json', 'glm',
  ],
  'TypeScript': [
    'Zod', 'ts-morph', 'type-fest', 'tRPC', 'class-validator',
    'fp-ts', 'io-ts',
  ],
  'JavaScript': [
    'ESLint', 'Prettier', 'Babel', 'Webpack', 'Vite', 'Rollup', 'esbuild',
  ],
  'Python': [
    'NumPy', 'Pandas', 'FastAPI', 'Pydantic', 'pytest',
    'Typer', 'SQLAlchemy', 'Alembic', 'Celery', 'httpx',
  ],
  'React': [
    'TanStack Query (React Query)', 'Redux Toolkit', 'Zustand', 'Jotai',
    'React Hook Form', 'Framer Motion', 'React Three Fiber', 'React Router',
    'React Testing Library', 'shadcn/ui', 'Radix UI', 'Headless UI',
    'React Spring', 'Recharts',
  ],
  'Next.js': [
    'tRPC', 'Prisma', 'Auth.js (NextAuth)', 'Vercel AI SDK',
    'next-intl', 'next-sitemap',
  ],
  'Three.js': [
    'Drei (@react-three/drei)', 'Rapier Physics', 'GSAP', 'Cannon.js',
    'Postprocessing', 'Leva (controls)', 'Troika Text',
  ],
  'WebGL': [
    'GLSL Shaders', 'WebGPU', 'TWGL', 'OGL',
  ],
  'Node.js': [
    'Express', 'Fastify', 'Hono', 'Socket.io', 'Prisma', 'Drizzle ORM',
    'BullMQ', 'Passport.js', 'Jest', 'Vitest', 'Pino (logging)',
  ],
  'OpenXR': [
    'OpenXR Toolkit', 'Monado', 'OpenComposite',
  ],
  'VR Platforms': [
    'SteamVR SDK', 'Meta XR SDK (Oculus)', 'VRTK 4', 'XR Interaction Toolkit',
    'OpenVR', 'Varjo SDK',
  ],
  'AR': [
    'ARCore', 'ARKit', 'AR Foundation (Unity)', 'Vuforia',
    'Immersal', 'Lightship ARDK',
  ],
  'Spatial Computing': [
    'visionOS (SwiftUI + RealityKit)', 'PolySpatial (Unity)',
    'HoloLens 2 SDK (MRTK3)', 'Magic Leap SDK',
  ],
  'Git': [
    'GitHub Actions', 'Git LFS', 'GitFlow', 'Conventional Commits',
    'Semantic Release', 'Husky + lint-staged',
  ],
  'Docker': [
    'Docker Compose', 'Kubernetes (k8s)', 'Helm', 'Docker Hub',
    'Buildx (multi-platform)',
  ],
  'AWS': [
    'EC2', 'S3', 'Lambda', 'CloudFormation / CDK', 'ECS / Fargate',
    'RDS', 'CloudFront', 'API Gateway', 'SQS / SNS',
  ],
  'Database Design': [
    'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase',
    'Firebase / Firestore', 'PlanetScale', 'Neon',
  ],
  'CI/CD': [
    'GitHub Actions', 'Jenkins', 'CircleCI', 'GitLab CI',
    'Vercel Deploy', 'Railway', 'Render',
  ],
};

const SKEL_WIDTHS = [58, 72, 45, 64, 52, 38, 61, 49];

const StackSkeleton = () => {
  const cats = [
    { name: 'ENGINES',   count: 3 },
    { name: 'LANGUAGES', count: 5 },
    { name: 'WEB',       count: 5 },
    { name: 'XR/3D',     count: 4 },
    { name: 'TOOLS',     count: 6 },
  ];
  return (
    <div className="asset-manifest">
      <div className="manifest-head">
        <div className="skel-stk-bar skel-stk-title pb-shimmer" />
        <div className="skel-stk-bar skel-stk-total pb-shimmer" />
      </div>
      {cats.map((cat, ci) => (
        <div key={cat.name} className="manifest-section">
          <div className="manifest-section-head">
            <div className="skel-stk-bar skel-stk-cat pb-shimmer" />
            <div className="skel-stk-bar skel-stk-count pb-shimmer" />
          </div>
          <div className="manifest-items">
            {Array.from({ length: cat.count }).map((_, i) => (
              <div key={i} className="manifest-item-group">
                <div className="manifest-item">
                  <span className="manifest-diamond" style={{ opacity: 0.2 }}>◆</span>
                  <div
                    className="skel-stk-bar pb-shimmer"
                    style={{ width: `${SKEL_WIDTHS[(ci + i) % SKEL_WIDTHS.length]}%`, height: 10 }}
                  />
                  <div className="skel-stk-bar skel-stk-pkg pb-shimmer" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SceneStack = () => {
  const [tech, setTech] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Stack');
    emit('info', '> Loading technology stack...');

    fetchTechnologies()
      .then(data => {
        setTech(data);
        emit('ok', `✓ Loaded ${data.length} technologies`);
      })
      .catch(() => {
        emit('error', `✗ Failed to load technologies`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [emit]);

  const categories = [
    {
      name: 'Engines',
      color: '#3b82f6',
      items: ['Unity', 'Unreal Engine', 'Custom engines'],
    },
    {
      name: 'Languages',
      color: '#f59e0b',
      items: ['C#', 'C++', 'TypeScript', 'JavaScript', 'Python'],
    },
    {
      name: 'Web',
      color: '#10b981',
      items: ['React', 'Next.js', 'Three.js', 'WebGL', 'Node.js'],
    },
    {
      name: 'XR/3D',
      color: '#8b5cf6',
      items: ['OpenXR', 'Spatial Computing', 'VR Platforms', 'AR'],
    },
    {
      name: 'Tools',
      color: '#ec4899',
      items: ['Git', 'CI/CD', 'Docker', 'AWS', 'Vercel', 'Database Design'],
    },
  ];

  const categorizeApiTech = (techArray) => {
    const keywordMap = {
      'Engines':   ['unity', 'unreal', 'engine', 'godot'],
      'Languages': ['c#', 'c++', 'typescript', 'javascript', 'python', 'rust', 'go', 'glsl', 'hlsl'],
      'Web':       ['react', 'next', 'three', 'webgl', 'node', 'vue', 'angular', 'svelte', 'html', 'css'],
      'XR/3D':     ['openxr', 'vr', 'ar', 'xr', 'spatial', 'hololens', 'quest', 'blender', 'substance'],
      'Tools':     ['git', 'docker', 'aws', 'vercel', 'ci', 'cd', 'sql', 'postgres', 'redis', 'jira', 'jenkins'],
    };
    const result = {};
    categories.forEach(cat => { result[cat.name] = { color: cat.color, items: [] }; });
    const uncategorized = [];
    techArray.forEach(t => {
      const name = (typeof t === 'string' ? t : (t.name || String(t))).toLowerCase();
      const display = typeof t === 'string' ? t : (t.name || String(t));
      let placed = false;
      for (const [catName, kws] of Object.entries(keywordMap)) {
        if (kws.some(kw => name.includes(kw))) {
          result[catName].items.push(display);
          placed = true;
          break;
        }
      }
      if (!placed) uncategorized.push(display);
    });
    result['Tools'].items.push(...uncategorized);
    return result;
  };

  const categorized = tech.length > 0 ? categorizeApiTech(tech) : null;

  const toggleItem = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalCount = tech.length > 0
    ? tech.length
    : categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="scene-stack">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Stack</h1>

        {loading ? (
          <StackSkeleton />
        ) : (
          <div className="asset-manifest">
            <div className="manifest-head">
              <span className="manifest-title">TECHNOLOGY MANIFEST</span>
              <span className="manifest-total">{totalCount} items</span>
            </div>
            {categories.map((cat) => {
              const items = categorized ? categorized[cat.name].items : cat.items;
              if (items.length === 0) return null;
              return (
                <div key={cat.name} className="manifest-section">
                  <div className="manifest-section-head" style={{ '--cat-color': cat.color }}>
                    <span className="manifest-cat-name">{cat.name.toUpperCase()}</span>
                    <span className="manifest-cat-count">{items.length}</span>
                  </div>
                  <div className="manifest-items">
                    {items.map((item, i) => {
                      const packages = PACKAGES_MAP[item] || [];
                      const key = `${cat.name}-${item}`;
                      const isOpen = !!expanded[key];
                      const hasPackages = packages.length > 0;
                      return (
                        <div key={i} className="manifest-item-group">
                          <div
                            className={`manifest-item${hasPackages ? ' manifest-item--expandable' : ''}${isOpen ? ' manifest-item--open' : ''}`}
                            onClick={hasPackages ? () => toggleItem(key) : undefined}
                          >
                            <span className="manifest-diamond">◆</span>
                            <span className="manifest-item-name">{item}</span>
                            {hasPackages && (
                              <span className="manifest-expand-hint">
                                <span className="manifest-pkg-count">{packages.length} pkg</span>
                                <span className="manifest-chevron">{isOpen ? '▾' : '▸'}</span>
                              </span>
                            )}
                          </div>
                          {hasPackages && isOpen && (
                            <div className="manifest-packages">
                              {packages.map((pkg, j) => (
                                <div key={j} className="manifest-pkg-item">
                                  <span className="manifest-pkg-bullet">·</span>
                                  <span className="manifest-pkg-name">{pkg}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneStack;
