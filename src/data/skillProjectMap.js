/**
 * Maps skills to showcase projects and descriptions
 * Used by SkillShowcase component to display what you build with each skill
 */

export const skillProjectMap = {
  "Unreal Engine": {
    color: "#00ff88",
    description: "Build AAA-quality gameplay systems, multiplayer networking, and optimized graphics",
    focus: "Game engines, systems, performance",
    projectKeywords: ["unreal", "ue4", "ue5", "c++"],
    examples: [
      "Advanced multiplayer networking systems",
      "High-performance gameplay mechanics",
      "Custom shader and graphics pipelines"
    ]
  },
  "Unity": {
    color: "#00d9ff",
    description: "Create diverse games with robust gameplay, networking, and cross-platform support",
    focus: "Cross-platform development, gameplay, optimization",
    projectKeywords: ["unity", "c#", "game"],
    examples: [
      "Multiplayer game systems",
      "Mobile-optimized gameplay",
      "Real-time networking solutions"
    ]
  },
  "C++": {
    color: "#ff00ff",
    description: "Write high-performance, systems-level code for games and engines",
    focus: "Performance, systems programming, optimization",
    projectKeywords: ["c++", "unreal", "performance"],
    examples: [
      "Gameplay systems and frameworks",
      "Performance-critical algorithms",
      "Engine-level optimizations"
    ]
  },
  "C#": {
    color: "#00ff88",
    description: "Develop robust, maintainable game systems and mechanics",
    focus: "Game systems, gameplay programming, architecture",
    projectKeywords: ["c#", "unity", "networking"],
    examples: [
      "Networking systems and protocols",
      "Player mechanics and controllers",
      "Game state management"
    ]
  },
  "Gameplay Programming": {
    color: "#bd00ff",
    description: "Design and implement core gameplay mechanics, player controllers, and game systems",
    focus: "Mechanics, systems design, player experience",
    projectKeywords: ["gameplay", "mechanics", "player", "controller", "system"],
    examples: [
      "Player movement and interaction systems",
      "Game mechanic implementations",
      "State machine and behavior systems"
    ]
  },
  "Game Design": {
    color: "#00d9ff",
    description: "Design engaging mechanics, progression systems, and compelling gameplay loops",
    focus: "Mechanics, progression, player experience",
    projectKeywords: ["game", "mechanics", "design"],
    examples: [
      "Game mechanics and systems design",
      "Player progression systems",
      "Engaging gameplay loops"
    ]
  },
  "Graphics Programming": {
    color: "#ff00ff",
    description: "Optimize rendering, create visual effects, and implement custom shaders",
    focus: "Rendering optimization, visual effects, performance",
    projectKeywords: ["graphics", "optimization", "shader"],
    examples: [
      "Custom shader development",
      "Rendering optimization techniques",
      "Visual effect systems"
    ]
  },
  "Multiplayer Systems": {
    color: "#39ff14",
    description: "Build scalable networking architectures for real-time multiplayer games",
    focus: "Networking, synchronization, scalability",
    projectKeywords: ["multiplayer", "networking", "replication"],
    examples: [
      "Custom networking protocols",
      "Player synchronization systems",
      "Scalable server architecture"
    ]
  },
  "Performance Optimization": {
    color: "#00fff9",
    description: "Profile, analyze, and optimize game code for maximum efficiency",
    focus: "Profiling, optimization, memory management",
    projectKeywords: ["optimization", "performance", "profile"],
    examples: [
      "GPU optimization techniques",
      "Memory management strategies",
      "Frame rate optimization"
    ]
  }
};

/**
 * Enhanced skills array with descriptions
 */
export const enhancedSkills = Object.entries(skillProjectMap).map(([name, data]) => ({
  name,
  color: data.color,
  description: data.description,
  focus: data.focus,
  examples: data.examples
}));

/**
 * Skill categories for better organization
 */
export const skillCategories = {
  "Game Engines": ["Unreal Engine", "Unity"],
  "Programming Languages": ["C++", "C#"],
  "Core Competencies": ["Gameplay Programming", "Graphics Programming", "Multiplayer Systems", "Performance Optimization"],
  "Specializations": ["Game Design"]
};
