import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

type Props = {
  radius: number,
  stroke: number
  progress: number;
};

export function ProgressRing({ radius, stroke, progress }: Props) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  return (
    <StyledWrapper>
      <svg
        height={radius * 2}
        width={radius * 2}
      >
        <StyledCircle
          stroke="var(--yellow-200)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          stroke-width={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          fill="var(--gray-500)"
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {progress.toFixed(2)}%
        </text>
      </svg>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCircle = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;
