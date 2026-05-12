import './InspField.css';

const InspField = ({ label, value, index = 0 }) => {
  return (
    <div className="insp-field" style={{ '--i': index }}>
      <div className="insp-label">{label}</div>
      <div className="insp-value">{value}</div>
    </div>
  );
};

export default InspField;
