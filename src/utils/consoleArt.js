/**
 * Console Easter Egg - Displays ASCII art and messages for curious developers
 */

export const displayConsoleArt = () => {
  // Clear console for clean display
  console.clear();

  // ASCII Art Banner
  console.log(
    '%c' +
      '\n' +
      '╔════════════════════════════════════════════════════════════╗\n' +
      '║                                                            ║\n' +
      '║     👋  Welcome to my portfolio!                          ║\n' +
      '║                                                            ║\n' +
      '║     Built with React 19 + TypeScript                      ║\n' +
      '║     Animations powered by Framer Motion                   ║\n' +
      '║     Deployed on Vercel                                    ║\n' +
      '║                                                            ║\n' +
      '║     🚀  Check out the code on GitHub                      ║\n' +
      '║                                                            ║\n' +
      '╚════════════════════════════════════════════════════════════╝\n',
    'color: #00ff88; font-family: monospace; font-size: 12px; line-height: 1.5;'
  );

  // Role Title
  console.log(
    '%c🎮 Game Developer | Software Engineer',
    'font-size: 20px; font-weight: bold; color: #00ff88; text-shadow: 0 0 10px #00ff88;'
  );

  // Curious Developer Message
  console.log(
    '%c🔍 Curious developer? I like you!',
    'font-size: 16px; color: #00d9ff; font-weight: bold;'
  );

  // Tech Stack
  console.log(
    '%c\n📚 Tech Stack:',
    'font-size: 14px; color: #ff00ff; font-weight: bold;'
  );
  console.log(
    '%c   • React 19.2.3\n   • Framer Motion 12.23.26\n   • React Router 7.11.0\n   • SCSS Modules\n   • Vercel Analytics',
    'font-size: 12px; color: #ffffff; line-height: 1.8;'
  );

  // Fun Fact
  console.log(
    '%c\n💡 Fun Fact:',
    'font-size: 14px; color: #ff00ff; font-weight: bold;'
  );
  console.log(
    '%c   This portfolio features particle physics, 3D card effects,\n   and a comprehensive case study system!',
    'font-size: 12px; color: #ffffff; line-height: 1.8;'
  );

  // Contact Info
  console.log(
    '%c\n📬 Want to work together?',
    'font-size: 14px; color: #ff00ff; font-weight: bold;'
  );
  console.log(
    '%c   Find me on GitHub, LinkedIn, or drop me an email!\n',
    'font-size: 12px; color: #ffffff;'
  );

  // Easter Egg Hint
  console.log(
    '%c🎁 Psst... Try the Konami Code: ↑↑↓↓←→←→BA',
    'font-size: 11px; color: #6b7b8c; font-style: italic;'
  );
};
