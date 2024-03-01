import { SVGAttributes } from 'react'

export const ReplyCredit = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <clipPath id="main">
        <rect width="24" height="24" fill="white" fillOpacity="0" />
      </clipPath>
    </defs>
    <g clipPath="url(#main)">
      <path
        d="M12 15C15.3135 15 18 12.2347 18 8.82361L18 2L6 2L6 8.82361C6 12.2347 8.68652 15 12 15Z"
        fill="#FBACA3"
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        d="M18 8.82361L18 2L6 2L6 8.82361C6 12.2347 8.68652 15 12 15C15.3135 15 18 12.2347 18 8.82361Z"
        stroke="#F26B4E"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 5.5L2 5.5C2 8.83337 4 10.5 6 10.5L6 5.5Z"
        stroke="#F26B4E"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 5.5L22 5.5C22 8.83337 20 10.5 18 10.5L18 5.5Z"
        stroke="#F26B4E"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 16L12 18"
        stroke="#F26B4E"
        strokeOpacity="1"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M7.5 21L9.34521 18L14.5215 18L16.5 21L7.5 21Z"
        fill="#FBACA3"
        fillOpacity="1.000000"
        fillRule="nonzero"
      />
      <path
        d="M9.34521 18L14.5215 18L16.5 21L7.5 21L9.34521 18Z"
        stroke="#F26B4E"
        strokeOpacity="1.000000"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
