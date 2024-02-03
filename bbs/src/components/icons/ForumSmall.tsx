import { css } from '@emotion/react'

const ForumSmall = ({ color }: { color?: string }) => {
  color = color || '#606266'
  return (
    <svg
      width="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M7.66675 6.66666L7.66675 2L2 2L2 6.66666L7.66675 6.66666Z"
          className="fill"
          css={css({ fill: color })}
        />
        <path
          d="M7.66675 2L2 2L2 6.66666L7.66675 6.66666L7.66675 2Z"
          className="stroke"
          css={css({
            stroke: color,
            strokeLinejoin: 'round',
          })}
        />
        <path
          d="M14 14L14 9.33331L8.33325 9.33331L8.33325 14L14 14Z"
          className="fill"
          css={css({ fill: color })}
        />
        <path
          d="M14 9.33331L8.33325 9.33331L8.33325 14L14 14L14 9.33331Z"
          className="stroke"
          css={css({
            stroke: color,
            strokeLinejoin: 'round',
          })}
        />
        <path
          d="M10.3333 2L10.3333 6.66666L14 6.66666L14 2L10.3333 2Z"
          className="fill"
          css={css({ fill: color })}
        />
        <path
          d="M10.3333 6.66666L14 6.66666L14 2L10.3333 2L10.3333 6.66666Z"
          className="stroke"
          css={css({
            stroke: color,
            strokeLinejoin: 'round',
          })}
        />
        <path
          d="M2 9.33331L2 14L5.66675 14L5.66675 9.33331L2 9.33331Z"
          className="fill"
          css={css({ fill: color })}
        />
        <path
          d="M2 14L5.66675 14L5.66675 9.33331L2 9.33331L2 14Z"
          className="stroke"
          css={css({
            stroke: color,
            strokeLinejoin: 'round',
          })}
        />
      </g>
    </svg>
  )
}

export default ForumSmall
