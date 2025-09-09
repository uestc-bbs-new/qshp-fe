export const sleep = (millisecond: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecond))
