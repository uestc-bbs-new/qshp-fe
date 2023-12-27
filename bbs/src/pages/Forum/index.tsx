import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  useTheme,
} from '@mui/material'
import { SelectInputProps } from '@mui/material/Select/SelectInput'

import { getThreadList } from '@/apis/common'
import { ForumDetails, ThreadType } from '@/common/interfaces/response'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Error from '@/components/Error'
import Link, { MenuItemLink } from '@/components/Link'
import ThreadItem from '@/components/ThreadItem'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { scrollAnchorSx } from '@/utils/scrollAnchor'
import { searchParamsAssign } from '@/utils/tools'

import Head from './ForumHead'
import SubForums from './SubForums'

type TopProps = {
  children: React.ReactElement
}
const Top = ({ children }: TopProps) => {
  const [isTopOpen, setTopOpen] = useState(true)
  const theme = useTheme()
  const handleClick = () => {
    setTopOpen(!isTopOpen)
  }
  return (
    <>
      <ListItemButton
        // disableGutters
        onClick={handleClick}
      >
        <ListItemText>置顶主题</ListItemText>
        {isTopOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      <Collapse in={isTopOpen} timeout="auto" unmountOnExit>
        {/* <Skeleton></Skeleton> */}
        {isTopOpen && children}
      </Collapse>
    </>
  )
}

const kSortByValues = [
  { id: 1, text: '最新回复' },
  { id: 2, text: '最新发表' },
  { id: 3, text: '最多回复' },
  { id: 4, text: '最热主题' },
]

type NormalProps = {
  query: any
  searchParams: URLSearchParams
  onChange?: SelectInputProps['onChange']
  children: React.ReactElement
}
const Normal = ({ query, searchParams, onChange, children }: NormalProps) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const value = query.sort_by || kSortByValues[0].id
  return (
    <>
      <ListItem>
        <ListItemText>普通主题</ListItemText>
        <Select
          variant="standard"
          disableUnderline
          value={value}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={onChange}
        >
          {kSortByValues.map((item, index) => (
            <MenuItem
              key={index}
              value={item.id}
              component={MenuItemLink}
              to={pages.forum(
                query.forum_id,
                searchParamsAssign(searchParams, { page: 1, sortby: item.id })
              )}
              preventScrollReset
            >
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      {children}
    </>
  )
}

const ForumPagination = forwardRef(function ForumPagination(
  {
    count,
    page,
    onChange,
  }: {
    count: number
    page: number
    onChange: (_: React.ChangeEvent<unknown>, page: number) => void
  },
  ref
) {
  return count > 1 ? (
    <Pagination
      size="small"
      count={count}
      page={page}
      onChange={onChange}
      boundaryCount={3}
      siblingCount={1}
      variant="outlined"
      shape="rounded"
      style={{ margin: '20px' }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        ...scrollAnchorSx,
      }}
      ref={ref}
    />
  ) : (
    <></>
  )
})

const ThreadTypeFilter = ({
  forumId,
  type,
}: {
  forumId: number
  type?: ThreadType
}) => {
  const [searchParams, _] = useSearchParams()
  return (
    <Link
      to={pages.forum(
        forumId,
        type &&
          new URLSearchParams({
            typeid: type.type_id.toString(),
          })
      )}
      preventScrollReset
      my={0.5}
    >
      <Chip
        text={type?.name || '全部'}
        size="large"
        type={
          (type?.type_id?.toString() || null) == searchParams.get('typeid')
            ? 'threadTypeActive'
            : 'threadType'
        }
      />
    </Link>
  )
}

function Forum() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const forumId = parseInt(useParams().id || '0')
  const [searchParams] = useSearchParams()
  const [total, setTotal] = useState(0)
  const [forumDetails, setForumDetails] = useState<ForumDetails | undefined>(
    undefined
  )
  const initQuery = (forumChanged?: boolean) => {
    const sortBy = searchParams.get('sortby') || '1'
    const typeId = searchParams.get('typeid')
    return {
      forum_id: forumId,
      page: parseInt(searchParams.get('page') || '1') || 1,
      sort_by: parseInt(sortBy) || 1,
      type_id: (typeId && parseInt(typeId)) || undefined,
      forum_details: forumChanged || !forumDetails,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const threadListTop = useRef<HTMLElement>()

  const pageSize = 20
  const {
    data: threadList,
    isLoading,
    refetch,
    isFetching,
    isError,
    error,
  } = useQuery(['getThread', query], () => getThreadList(query), {
    onSuccess: (data: any) => {
      if (data && data.total) {
        setTotal(Math.ceil(data.total / pageSize))
      }
      if (data && data.forum) {
        setForumDetails(data.forum)
        dispatch({ type: 'set forum', payload: data.forum })
      }
    },
  })

  useEffect(() => {
    setForumDetails(undefined)
  }, [forumId])
  useEffect(() => {
    let forumChanged = false
    if (forumId != query.forum_id) {
      forumChanged = true
    }
    setQuery(initQuery(forumChanged))
    refetch()
  }, [forumId, searchParams, state.user.uid])

  const handlePageChange = (_: any, newPage: number) => {
    navigate(
      `${location.pathname}?${searchParamsAssign(searchParams, {
        page: newPage,
      })}`,
      { preventScrollReset: true }
    )
    threadListTop.current?.scrollIntoView()
  }

  return (
    <Box className="flex-1" style={{ marginTop: '20px' }}>
      {isError ? (
        <Error isError={isError} error={error} onRefresh={refetch} />
      ) : (
        <>
          {isFetching && !forumDetails ? (
            <Card>
              <List>
                <ListItem>
                  <Skeleton className="w-full" height={81}></Skeleton>
                </ListItem>
              </List>
            </Card>
          ) : forumDetails ? (
            <Head data={forumDetails}></Head>
          ) : null}
          {forumDetails?.children?.length && (
            <SubForums>{forumDetails.children}</SubForums>
          )}
          {!!(isFetching || threadList?.rows?.length) && (
            <>
              <ForumPagination
                count={total}
                page={query.page}
                onChange={handlePageChange}
                ref={threadListTop}
              />
              <Stack direction="row" sx={{ flexWrap: 'wrap' }} my={2.5} px={2}>
                {(forumDetails?.thread_types || []).length > 0 && (
                  <ThreadTypeFilter key="all" forumId={forumId} />
                )}
                {forumDetails?.thread_types.map((item, index) => (
                  <ThreadTypeFilter key={index} forumId={forumId} type={item} />
                ))}
              </Stack>
              <Card>
                <>
                  {threadList?.rows?.some(
                    (item: any) => item.display_order > 0
                  ) && (
                    <Top>
                      {isFetching ? (
                        <List>
                          <ListItem>
                            <Skeleton className="w-full" height={81}></Skeleton>
                          </ListItem>
                        </List>
                      ) : (
                        <List>
                          {threadList?.rows
                            ?.filter((item: any) => item.display_order > 0)
                            .map((item: any) => (
                              <ThreadItem
                                data={item}
                                key={item.thread_id}
                                forumDetails={forumDetails}
                              />
                            ))}
                        </List>
                      )}
                    </Top>
                  )}
                  <Normal
                    query={query}
                    searchParams={searchParams}
                    onChange={() => threadListTop.current?.scrollIntoView()}
                  >
                    {isFetching ? (
                      <List>
                        {[...Array(8)].map((_, index) => (
                          <ListItem key={index}>
                            <Skeleton className="w-full" height={100} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <List>
                        {threadList?.rows
                          ?.filter((item: any) => item.display_order === 0)
                          .map((item: any) => (
                            <ThreadItem
                              data={item}
                              key={item.thread_id}
                              forumDetails={forumDetails}
                            />
                          ))}
                      </List>
                    )}
                  </Normal>
                </>
              </Card>
              <ForumPagination
                count={total}
                page={query.page}
                onChange={handlePageChange}
              />
            </>
          )}
          {/* <Edit></Edit> */}
        </>
      )}
    </Box>
  )
}
export default Forum
