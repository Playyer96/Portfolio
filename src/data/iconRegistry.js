import {
  FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs,
  FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaApple,
  FaAndroid, FaGooglePlay, FaWindows, FaLinux,
} from 'react-icons/fa';
import {
  SiUnrealengine, SiCplusplus, SiSharp, SiPerforce,
  SiMongodb, SiThreedotjs, SiWebgl, SiFirebase,
  SiVercel, SiAmazonaws, SiTypescript, SiOpenai,
} from 'react-icons/si';
import {
  FiZap, FiTool, FiRefreshCw, FiBarChart2, FiGlobe, FiBook,
  FiBox, FiLayers, FiGrid, FiPackage, FiSmartphone,
  FiMonitor, FiServer, FiCloud, FiCode,
} from 'react-icons/fi';

const registry = {
  // Languages
  'react':       FaReact,
  'react 19':    FaReact,
  'react.js':    FaReact,
  'reactjs':     FaReact,
  'unity':       FaUnity,
  'c#':          SiSharp,
  'csharp':      SiSharp,
  'c++':         SiCplusplus,
  'cpp':         SiCplusplus,
  'typescript':  SiTypescript,
  'javascript':  FaJs,
  'python':      FaPython,
  'html5':       FaHtml5,
  'css3':        FaCss3Alt,

  // Engines
  'unreal engine':    SiUnrealengine,
  'unreal engine 5':  SiUnrealengine,
  'unreal':           SiUnrealengine,
  'unity 3d':         FaUnity,
  'custom engines':   FiBox,

  // Web
  'three.js':      SiThreedotjs,
  'webgl':         SiWebgl,
  'node.js':       FaNodeJs,
  'nodejs':        FaNodeJs,
  'node':          FaNodeJs,
  'next.js':       SiVercel,
  'nextjs':        SiVercel,

  // Databases & Cloud
  'mongodb':       SiMongodb,
  'firebase':      SiFirebase,
  'vercel':        SiVercel,
  'aws':           SiAmazonaws,

  // Tools
  'git':           FaGitAlt,
  'github':        FaGithub,
  'gitlab':        FaGitlab,
  'docker':        FaDocker,
  'perforce':      SiPerforce,

  // Platforms
  'ios':           FaApple,
  'android':       FaAndroid,
  'google play':   FaGooglePlay,
  'windows':       FaWindows,
  'linux':         FaLinux,

  // Generic fallbacks by category
  'engines':       FiBox,
  'languages':     FiCode,
  'web':           FiGrid,
  'xr3d':          FiLayers,
  'xr / 3d':       FiLayers,
  'tools':         FiTool,
  'mobile':        FiSmartphone,
  'desktop':       FiMonitor,
  'server':        FiServer,
  'cloud':         FiCloud,

  // Feature / value icons
  'fizap':         FiZap,
  'fitool':        FiTool,
  'firefreshcw':   FiRefreshCw,
  'fibarChart2':   FiBarChart2,
  'figlobe':       FiGlobe,
  'fibook':        FiBook,
  'fipackage':     FiPackage,
};

export function resolveIcon(name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return registry[key] || null;
}

export function getIconComponent(name) {
  const Icon = resolveIcon(name);
  return Icon || null;
}

export default registry;
