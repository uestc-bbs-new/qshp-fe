import React, { createContext, useContext, useState } from 'react'

export type BreadcrumbState = {
  collection?: {
    name: string
    id: number
  }
}

const initialState = {}
const BreadcrumbContext = createContext({
  breadcrumb: initialState,
  setBreadcrumb: (_: BreadcrumbState) => {},
})

export const useBreadcrumb = () => useContext(BreadcrumbContext)
export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbState>(initialState)
  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}
