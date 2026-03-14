import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import './Knob.css';

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

const Knob = ({
  value,
  min,
  max,
  onChange,
  label,
  size = 60,
  color = '#38bdf8',
  unit = '',
  step = 1,
}: KnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(0);
  const cleanupDragRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cleanupDragRef.current?.();
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
    startY.current = event.clientY;
    startValue.current = value;
    event.currentTarget.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = startY.current - moveEvent.clientY;
      const range = max - min;
      const pixelsPerRange = 200;

      let nextValue = startValue.current + (deltaY / pixelsPerRange) * range;
      nextValue = Math.max(min, Math.min(max, nextValue));

      if (step) {
        nextValue = Math.round(nextValue / step) * step;
      }

      onChange(nextValue);
    };

    const stopDrag = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
      window.removeEventListener('blur', stopDrag);
      cleanupDragRef.current = null;
    };

    cleanupDragRef.current?.();
    cleanupDragRef.current = stopDrag;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
    window.addEventListener('blur', stopDrag);
  };

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="knob nodrag">
      {label && <label className="knob__label">{label}</label>}

      <div
        onPointerDown={handlePointerDown}
        className={`knob__dial ${isDragging ? 'knob__dial--dragging' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeDasharray="188.5"
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(135 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
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

        <div
          className="knob__rotation"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="knob__body">
            <div className="knob__indicator" />
          </div>
        </div>
      </div>

      <div className="knob__value" style={{ color }}>
        {value.toFixed(value < 10 ? 2 : 0)}
        {unit}
      </div>
    </div>
  );
};

export default Knob;
