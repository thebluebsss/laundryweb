type IconSortCustomProps = {
  color?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
};
export const IconCollapse = ({ color, direction = 'down' }: IconSortCustomProps) => {
  const rotationMap = {
    up: 'rotate(0deg)',
    down: 'rotate(180deg)',
    left: 'rotate(-90deg)',
    right: 'rotate(90deg)'
  };
  return (
    <svg
      style={{ transform: rotationMap[direction], transition: 'transform 0.2s ease-in-out' }}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none">
      <path
        d="M7.05617 5.12805C6.96986 5.29278 6.79925 5.396 6.61328 5.396L1.36328 5.396C1.17731 5.396 1.0067 5.29278 0.92039 5.12805C0.834079 4.96332 0.846327 4.7643 0.952184 4.61139L3.57718 0.819724C3.67058 0.684825 3.98828 0.604329 3.98828 0.604329C3.98828 0.604329 4.30598 0.684825 4.39938 0.819724L7.02438 4.61139C7.13023 4.7643 7.14248 4.96332 7.05617 5.12805Z"
        fill={color || '#5F5F5F'}
      />
    </svg>
  );
};
