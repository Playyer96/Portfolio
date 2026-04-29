/**
 * Console Art Utility
 *
 * Displays ASCII art and welcome message in the browser console
 * Fun easter egg for curious developers who open DevTools
 */

export const displayConsoleArt = (): void => {
  console.clear();

  // ASCII Art Banner
  console.log(
    '%c' +
      '\n' +
      '╔════════════════════════════════════════════════════════════╗\n' +
      '║     👋  Welcome to my portfolio!                          ║\n' +
      '║                                                            ║\n' +
      '║     Built with React + TypeScript + Framer Motion         ║\n' +
      '║                                                            ║\n' +
      '║     🎮  Game Developer | Unreal & Unity                   ║\n' +
      '║     🚀  Check out the code on GitHub                      ║\n' +
      '╚════════════════════════════════════════════════════════════╝\n',
    'color: #00ff88; font-family: monospace;'
  );

  // Welcome Message
  console.log(
    '%c🎮 Game Developer | Software Engineer',
    'font-size: 20px; font-weight: bold; color: #00ff88;'
  );

  console.log(
    '%c🔍 Curious developer? I like you!',
    'font-size: 16px; color: #00d9ff;'
  );

  console.log(
    '%cTech Stack:',
    'font-size: 14px; font-weight: bold; color: #ff00ff; margin-top: 10px;'
  );

  console.log(
    '%c• React 19 + TypeScript\n• Framer Motion for animations\n• SCSS for styling\n• Vercel for hosting',
    'font-size: 12px; color: #b3b3b3; line-height: 1.5;'
  );

  // GitHub Link
  console.log(
    '%c\n📂 Source Code: https://github.com/Playyer96',
    'font-size: 14px; color: #00d9ff;'
  );

  // Fun Easter Egg Hint
  console.log(
    '%c\n💡 Tip: Try the Konami code! ↑ ↑ ↓ ↓ ← → ← → B A',
    'font-size: 12px; font-style: italic; color: #6b7b8c;'
  );

  // Footer
  console.log(
    '%c\n---\nMade with ❤️ by Danilo Vanegas\n',
    'font-size: 11px; color: #6b7b8c;'
  );
};
