import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

const Slide = ({ children }: { children: React.ReactElement | string }) => {
  return <div className="min-h-40">{children}</div>
}

const AutoPlay = autoPlay(SwipeableViews)

const Announcement = () => {
  // const {data, isLoading} =

  return (
    <AutoPlay className="mb-4">
      <Slide>slide n°1</Slide>
      <Slide>slide n°2</Slide>
      <Slide>slide n°3</Slide>
    </AutoPlay>
  )
}

export default Announcement
