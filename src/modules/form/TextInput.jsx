import PropTypes from "prop-types";

function TextInput({ name, label, onChange, value = "", className, id = "" }) {
  return (
    <div className="pure-control-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={id || name}
        type="text"
        onChange={onChange}
        name={name}
        className={className}
        value={value}
      />
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default TextInput;
