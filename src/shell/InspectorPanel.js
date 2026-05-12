import { useLocation } from 'react-router-dom';
import './InspectorPanel.css';
import PanelSection from '../ui/PanelSection';
import InspField from '../ui/InspField';
import useTheme from '../hooks/useTheme';

const InspectorPanel = ({ selectedProject = null, selectedExperience = null }) => {
  const location = useLocation();
  const { theme, accent, toggleTheme, setAccent } = useTheme();

  const renderContent = () => {
    switch (location.pathname) {
      case '/':
        return (
          <>
            <PanelSection title="Transform">
              <InspField label="Position X" value="0" index={0} />
              <InspField label="Position Y" value="0" index={1} />
              <InspField label="Rotation" value="0" index={2} />
            </PanelSection>
            <PanelSection title="Developer">
              <InspField label="Name" value="Danilo Vanegas" index={0} />
              <InspField label="Status" value="Available ●" index={1} />
              <InspField label="Role" value="Software Engineer" index={2} />
              <InspField label="Location" value="Colombia, UTC-5" index={3} />
            </PanelSection>
          </>
        );

      case '/about':
        return (
          <PanelSection title="Developer">
            <InspField label="Status" value="Available ●" index={0} />
            <InspField label="Location" value="Colombia, UTC-5" index={1} />
            <InspField label="Languages" value="Spanish, English" index={2} />
            <InspField label="Specialization" value="Full Stack / Game Dev" index={3} />
          </PanelSection>
        );

      case '/projects':
        return selectedProject ? (
          <PanelSection title="GameObject">
            <InspField label="Name" value={selectedProject.name} index={0} />
            <InspField label="Status" value={selectedProject.status || 'Live'} index={1} />
            <InspField label="Year" value={selectedProject.year || '2024'} index={2} />
            <InspField label="Role" value={selectedProject.role || 'Developer'} index={3} />
          </PanelSection>
        ) : (
          <PanelSection title="Projects">
            <InspField label="Count" value="5" index={0} />
            <InspField label="Status" value="Select a project" index={1} />
          </PanelSection>
        );

      case '/experience':
        return selectedExperience ? (
          <PanelSection title="GameObject">
            <InspField label="Company" value={selectedExperience.company} index={0} />
            <InspField label="Role" value={selectedExperience.role} index={1} />
            <InspField label="Period" value={selectedExperience.period} index={2} />
            <InspField label="Type" value={selectedExperience.type} index={3} />
          </PanelSection>
        ) : (
          <PanelSection title="Experience">
            <InspField label="Items" value="6" index={0} />
            <InspField label="Status" value="Select an item" index={1} />
          </PanelSection>
        );

      case '/cv':
        return (
          <PanelSection title="Asset">
            <InspField label="Name" value="CV-Danilo-2025.pdf" index={0} />
            <InspField label="Format" value="PDF" index={1} />
            <InspField label="Pages" value="1" index={2} />
          </PanelSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="inspector-panel">
      <div className="inspector-header">Inspector</div>
      <div className="inspector-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default InspectorPanel;
