import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { useAppState } from '@/states'

const Forum = () => {
  const { state, dispatch } = useAppState()
  const [tabIndex, setTabIndex] = useState(0)
  const routeParmas = useParams()

  return <div>Forums</div>
}

export default Forum
