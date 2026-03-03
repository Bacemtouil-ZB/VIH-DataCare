export default function ToggleSwitch({ 
  value, 
  onChange,
  labelOn = "Oui",
  labelOff = "Non",
  colorOn = "#10b981",
  colorOff = "#d1d5db",
  disabled = false,
  style = {}
}) {
  
  const handleClick = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           2,
        cursor:        disabled ? "not-allowed" : "pointer",
        userSelect:    "none",
        opacity:       disabled ? 0.5 : 1,
        ...style
      }}
    >
      {/* Track - TAILLE RÉDUITE */}
      <div
        style={{
          position:      "relative",
          width:         40,        // Était 52
          height:        22,        // Était 28
          borderRadius:  999,
          background:    value ? colorOn : colorOff,
          transition:    "background 0.25s ease",
          flexShrink:    0,
        }}
      >
        {/* Thumb - TAILLE RÉDUITE */}
        <div
          style={{
            position:     "absolute",
            top:          3,
            left:         value ? 21 : 3,  // Était 27
            width:        16,              // Était 22
            height:       16,              // Était 22
            borderRadius: "50%",
            background:   "#fff",
            boxShadow:    "0 1px 4px rgba(0,0,0,0.25)",
            transition:   "left 0.25s ease",
          }}
        />
      </div>

      {/* Label - TAILLE RÉDUITE */}
      <span
        style={{
          fontSize:   13,        // Était 14
          fontWeight: 600,
          color:      value ? colorOn : "#6b7280",
          minWidth:   18,        // Était 28
          transition: "color 0.2s",
        }}
      >
        {value ? labelOn : labelOff}
      </span>
    </div>
  );
}