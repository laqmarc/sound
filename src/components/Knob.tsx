import React, { useState, useEffect, useRef } from 'react';

interface KnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  size?: number;
  color?: string;
  unit?: string;
  step?: number;
}

const Knob: React.FC<KnobProps> = ({ 
  value, 
  min, 
  max, 
  onChange, 
  label, 
  size = 60, 
  color = '#38bdf8',
  unit = '',
  step = 1
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startValue = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY.current - moveEvent.clientY;
      const range = max - min;
      const pixelsPerRange = 200; 
      
      let newValue = startValue.current + (deltaY / pixelsPerRange) * range;
      newValue = Math.max(min, Math.min(max, newValue));
      
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      
      onChange(newValue);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Rotació del knob (de -135deg a 135deg)
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-1 select-none nodrag">
      {label && <label className="text-slate-400 text-[9px] uppercase pointer-events-none">{label}</label>}
      
      <div 
        ref={knobRef}
        onMouseDown={handleMouseDown}
        className="relative cursor-ns-resize touch-none"
        style={{ width: size, height: size }}
      >
        {/* Background circle */}
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="8" 
            strokeDasharray="188.5" 
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(135 50 50)"
          />
          {/* Active arc */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 - ((value - min) / (max - min)) * 188.5}
            strokeLinecap="round"
            transform="rotate(135 50 50)"
            className="transition-all duration-75"
          />
        </svg>

        {/* Knob center */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div 
            className="w-3/4 h-3/4 bg-slate-700 rounded-full shadow-lg border border-slate-600 flex items-start justify-center pt-1"
          >
            <div className="w-1 h-3 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono" style={{ color }}>
        {value.toFixed(value < 10 ? 2 : 0)}{unit}
      </div>
    </div>
  );
};

export default Knob;
