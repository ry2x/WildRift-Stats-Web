import React from 'react';

// This is an SVG component created from logo.svg with added gradient
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0.000999987 0 74.33 64.95"
      width="1em"
      height="1em"
      className="logo-svg"
      {...props}
    >
      <defs>
        {/* Define gradients for the header */}
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
          <stop offset="100%" stopColor="#9333ea" /> {/* purple-600 */}
        </linearGradient>
        {/* Define gradient for the title - synced with title-gradient in CSS */}
        <linearGradient
          id="title-sync-gradient"
          x1="0%"
          y1="0%"
          x2="200%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
          <stop offset="50%" stopColor="#9333ea" /> {/* purple-600 */}
          <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="1"
            to="-2"
            begin="3s"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <path
        fill={props.fill}
        d="M46.003,1.011C45.64,0.386,44.973,0,44.249,0c-0.723,0-1.393,
          0.386-1.753,1.011l-5.36,9.287l-5.309-9.196c-0.362-0.627-1.03-1.011-1.753-1.011c-0.726,0-1.393,0.384-1.753,
          1.011L0.271,49.685c-0.36,0.627-0.36,1.399,0,2.024c0.36,0.627,1.03,1.014,
          1.753,1.014h10.722l-5.309,9.195c-0.36,0.625-0.36,1.397,0,2.024c0.362,0.626,1.03,1.012,
          1.753,1.012h56.1c0.723,0,1.392-0.386,1.753-1.014c0.362-0.625,0.362-1.397,0-2.024l-5.36-9.285h10.616c0.004,
          0,0.007,0,0.009,0c1.117,0,2.024-0.904,2.024-2.022c0-0.432-0.135-0.829-0.362-1.156L46.003,
          1.011z M30.074,6.162l17.478,30.274h-9.248L31.979,25.48c-0.198-0.344-0.49-0.609-0.831-0.785c-0.316-0.199-0.686-0.313-1.073-0.313c-0.726,
          0-1.393,0.386-1.753,1.013l-13.44,23.278H5.53L30.074,6.162z M12.696,60.904l17.479-30.273l4.623,
          8.009l-6.325,10.956c-0.199,0.344-0.283,0.731-0.265,1.115c-0.012,0.375,0.074,0.75,0.267,1.084c0.362,0.627,
          1.029,1.012,1.753,1.012h26.881l4.674,8.098H12.696z M33.837,48.582l4.622-8.007H51.11c0.002,0,0.005,0,0.007,
          0c0.425,0,0.817-0.132,1.143-0.354c0.309-0.175,0.571-0.43,0.754-0.748c0.362-0.625,0.362-1.397,0-2.023L39.575,
          14.17l4.674-8.097l24.543,42.509H33.837z"
      />
    </svg>
  );
}
