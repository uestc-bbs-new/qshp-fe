import React, { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey'
import OtherHousesIcon from '@mui/icons-material/OtherHouses'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material'

import { Forum } from '@/common/interfaces/forum'
import Link from '@/components/Link'
import { useAppState, useForumList } from '@/states'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

type NavLink = {
  link: string
  name: string
  external: boolean
}

type NavData<T extends boolean> = {
  data: T extends true ? Forum : NavLink[]
  navName?: string
  isForum: T //true时显示Forum部分
  Icon?: React.ElementType
}

const listServiceItems: NavLink[] = [
  {
    link: `${siteRoot}/graduate_bind/frontend/index.html`,
    name: '学号换绑',
    external: true,
  },
  {
    link: `${siteRoot}/member.php?mod=relevance`,
    name: '实名关联',
    external: true,
  },
  {
    link: `${siteRoot}/plugin.php?id=ahome_fv:index`,
    name: '亲密认证',
    external: true,
  },
  {
    link: `${siteRoot}/home.php?mod=medal`,
    name: '勋章中心',
    external: true,
  },
  {
    link: `${siteRoot}/home.php?mod=magic`,
    name: '道具商店',
    external: true,
  },
  {
    link: `${siteRoot}/home.php?mod=spacecp&ac=credit&op=exchange`,
    name: '论坛货币兑换',
    external: true,
  },
]

const schoolServiceItems: NavLink[] = [
  {
    link: pages.thread(1430861),
    name: '校车时刻表',
    external: false,
  },
  { link: pages.forum(305), name: '失物招领', external: false },
  { link: pages.thread(1493930), name: '校历', external: false },
  {
    link: 'https://hq.uestc.edu.cn/web/detail.jsp?article_id=4645',
    name: '网上报修',
    external: true,
  },
  { link: 'https://ecard.uestc.edu.cn/', name: '一卡通查询', external: true },
  {
    link: 'https://eportal.uestc.edu.cn/',
    name: '网上服务大厅',
    external: true,
  },
  {
    link: 'https://hq.uestc.edu.cn/yzs/commentSite/commentSiteIndex',
    name: '后勤建议',
    external: true,
  },
  { link: 'https://gis.uestc.edu.cn/', name: '校园地图', external: true },
  { link: 'https://www.lib.uestc.edu.cn/', name: '图书馆', external: true },
]

const OtherOption = [
  { link: 'https://www.lib.uestc.edu.cn/', name: '图书馆', external: true },
]

const renderLink = (
  link: string,
  name: string,
  key: string | number,
  external?: boolean
) => (
  <Link
    to={link}
    key={key}
    underline="none"
    color="inherit"
    external={external ?? false}
    target={external ? '_blank' : undefined}
  >
    <ListItemButton sx={{}}>
      <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
      <ListItemText>
        <Typography color="inherit" className="font-bold">
          {name}
        </Typography>
      </ListItemText>
    </ListItemButton>
  </Link>
)

const Ordinate = ({ data, isForum, navName, Icon }: NavData<boolean>) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon className=" min-w-10 text-[#0268FD]">
          {Icon !== undefined ? <Icon /> : <KeyboardCommandKeyIcon />}
        </ListItemIcon>
        <ListItemText>
          <Typography color="inherit" className=" font-normal text-black">
            {isForum ? (data as Forum).name : navName}
          </Typography>
        </ListItemText>
        {open ? (
          <ExpandLess fontSize="inherit" />
        ) : (
          <ExpandMore fontSize="inherit" />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {isForum
            ? (data as Forum)?.children
                ?.filter((item: any) => item.fid !== 0)
                .map((item: any) =>
                  renderLink(`/forum/${item.fid}`, item.name, item.name)
                )
            : (data as NavLink[]).map((item) =>
                renderLink(item.link, item.name, item.name, item.external)
              )}
        </List>
      </Collapse>
    </>
  )
}

const ListItemLink = ({
  link,
  name,
  Icon,
}: {
  link: string
  name: string
  Icon?: React.ElementType
}) => {
  return (
    <Link to={link} underline="none" color="inherit">
      <ListItemButton>
        <ListItemIcon className=" min-w-10" sx={{ color: '#0268FD' }}>
          {Icon ? <Icon /> : <KeyboardCommandKeyIcon />}
        </ListItemIcon>
        <ListItemText>
          <Typography color="inherit" className=" font-normal text-black">
            {name}
          </Typography>
        </ListItemText>
      </ListItemButton>
    </Link>
  )
}

const Sections = () => {
  const forumList = useForumList()
  return (
    <List style={{ color: '#7082a7' }} className=" pl-4">
      <ListItemLink
        link={pages.index()}
        name="首页"
        Icon={() => <OtherHousesIcon />}
      ></ListItemLink>
      <Ordinate data={listServiceItems} isForum={false} navName="论坛服务" />
      <Ordinate data={schoolServiceItems} isForum={false} navName="校园服务" />
      {/* todo: 禁止 hover  */}
      <ListItem>
        <ListItemText>
          <Typography color="inherit" className="font-bold text-zinc-900">
            板块
          </Typography>
        </ListItemText>
      </ListItem>
      <>
        {!forumList?.length ? (
          <List>
            <ListItem>
              <Skeleton className="w-full" height={32}></Skeleton>
            </ListItem>
            <ListItem>
              <Skeleton className="w-full" height={32}></Skeleton>
            </ListItem>
            <ListItem>
              <Skeleton className="w-full" height={32}></Skeleton>
            </ListItem>
          </List>
        ) : (
          forumList.map((item) => (
            <Ordinate key={item.name} data={item} isForum={true} navName="" />
          ))
        )}
      </>
      <ListItem>
        <ListItemText>
          <Typography color="inherit" className="font-bold text-zinc-900">
            其他
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItemLink
        link={pages.thread(1812091)}
        name="客户端下载"
      ></ListItemLink>
      <ListItemLink link={pages.index()} name="河畔小游戏"></ListItemLink>
    </List>
  )
}

const NavLinks = () => {
  const { state } = useAppState()

  return (
    <Box>
      <Toolbar />
      <Sections />
    </Box>
  )
}

export default NavLinks
