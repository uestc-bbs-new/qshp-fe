type Props = {
  children: Array<React.ReactElement>
  separator: React.ReactElement
}
const Separated = ({ children, separator }: Props) => {
  return (
    <>
      {children.map((child, index) => [
        child,
        index < children.length - 1 ? separator : <></>,
      ])}
    </>
  )
}

export default Separated
