import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 150 30" width="150" height="30" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text x="5" y="22" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="bold">
        <tspan fill="hsl(var(--sidebar-primary))">Permit</tspan><tspan fill="hsl(60, 80%, 90%)">Ease</tspan>
      </text>
    </svg>
  );
}
