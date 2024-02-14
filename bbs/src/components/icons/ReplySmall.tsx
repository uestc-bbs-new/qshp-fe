import { SVGAttributes } from 'react'

const ReplySmall = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    width="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path d="M14.6665 2L1.33325 2L1.33325 12L4.33325 12L4.33325 13.6667L7.6665 12L14.6665 12L14.6665 2Z" />
      <path
        d="M1.33325 2L1.33325 12L4.33325 12L4.33325 13.6667L7.6665 12L14.6665 12L14.6665 2L1.33325 2Z"
        stroke="#8BC4EC"
        strokeLinejoin="round"
      />
      <path d="M4.68677 7.47998L4.66675 7.5C4.38672 7.5 4.16675 7.28003 4.16675 7C4.16675 6.71997 4.38672 6.5 4.66675 6.5L4.68677 6.52002L4.68677 7.47998ZM11.3135 6.52002L11.3335 6.5C11.6135 6.5 11.8335 6.71997 11.8335 7C11.8335 7.28003 11.6135 7.5 11.3335 7.5L11.3135 7.47998L11.3135 6.52002Z" />
      <path
        d="M4.66675 7L11.3335 7"
        stroke="#8BC4EC"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  </svg>
)

export default ReplySmall
