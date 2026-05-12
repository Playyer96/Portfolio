import { useLocation } from 'react-router-dom';
import './StatusBar.css';

const StatusBar = ({ consoleCount = 0 }) => {
  const location = useLocation();

  const getSceneLabel = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">Scene: {getSceneLabel()}</span>
      </div>
      <div className="status-right">
        <span className="status-item">Console: {consoleCount} lines</span>
      </div>
    </div>
  );
};

export default StatusBar;
