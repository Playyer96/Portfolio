import './TweaksPanel.css';
import useTheme from '../hooks/useTheme';

const TweaksPanel = () => {
  const { theme, accent, toggleTheme, setAccent } = useTheme();

  const accents = ['lime', 'cyan', 'amber', 'magenta'];
  const accentColors = {
    lime: '#a8ff60',
    cyan: '#60d8ff',
    amber: '#ffc060',
    magenta: '#ff60c8',
  };

  return (
    <div className="tweaks-panel">
      <div className="tweaks-section">
        <label className="tweaks-label">Theme</label>
        <button
          className={`tweaks-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '◐ Dark' : '☀ Light'}
        </button>
      </div>

      <div className="tweaks-section">
        <label className="tweaks-label">Accent</label>
        <div className="tweaks-swatches">
          {accents.map(color => (
            <button
              key={color}
              className={`tweaks-swatch ${accent === color ? 'active' : ''}`}
              style={{ backgroundColor: accentColors[color] }}
              onClick={() => setAccent(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TweaksPanel;
