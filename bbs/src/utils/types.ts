export type FieldRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>
export type FieldOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>
