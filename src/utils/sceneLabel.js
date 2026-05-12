export const getSceneLabel = (pathname) => {
  if (!pathname || pathname === '/') return 'Home';
  return pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
};
