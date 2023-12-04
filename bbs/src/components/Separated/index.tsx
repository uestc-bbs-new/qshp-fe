import React from 'react'

type Props = {
  children: Array<React.ReactElement>
  separator: React.ReactElement
}
const Separated = ({ children, separator }: Props) => {
  return (
    <>
      {children.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < children.length - 1 ? separator : <></>}
        </React.Fragment>
      ))}
    </>
  )
}

export default Separated
