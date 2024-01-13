import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { Box } from '@mui/material'

import { getForumDetails } from '@/apis/common'
import { ForumDetails } from '@/common/interfaces/response'
import Card from '@/components/Card'
import PostEditor from '@/components/Editor/PostEditor'
import { useAppState } from '@/states'

const Edit = () => {
  const { dispatch } = useAppState()
  const routeParam = useParams()
  const routeState = useLocation().state
  const [query, setQuery] = useState({
    fid: routeParam.fid,
  })
  const { data: selectedForum, isFetching } = useQuery<ForumDetails>({
    queryKey: ['forumDetails', query],
    queryFn: async () => {
      if (query.fid) {
        if (
          query.fid == routeState?.forum?.fid &&
          routeState.forum.can_post_thraed
        ) {
          return routeState.forum
        }
        const forum = await getForumDetails(query.fid)
        if (forum.can_post_thread) {
          return forum
        }
      }
      return undefined
    },
  })

  useEffect(() => {
    setQuery({ fid: routeParam.fid })
  }, [routeParam.fid])

  useEffect(() => {
    dispatch({ type: 'set forum', payload: selectedForum })
  }, [selectedForum])
  return (
    <Box className="flex-1" mt={2} position="relative">
      <Card py={1.5}>
        <PostEditor forum={selectedForum} forumLoading={isFetching} />
      </Card>
    </Box>
  )
}

export default Edit
