import { Link as RouterLink, useLocation } from 'react-router-dom'

import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useAppState } from '@/states'

const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  color: theme.palette.primary.main,
}))

interface Dictionary {
  [key: string]: string
}

export const forumDictionary: Dictionary = {
  search: '搜索',
  2: '站务公告',
  46: '站务综合',
  3: '回收站',
  20: '学术交流',
  382: '考试专区',
  70: '程序员之家',
  316: '自然科学',
  66: '电子数码',
  121: 'IC电设',
  61: '二手专区',
  255: '房屋租贷',
  111: '店铺专区',
  305: '失物招领',
  391: '拼车同行',
  183: '兼职信息发布栏',
  312: '跑步公园',
  244: '成电骑迹',
  115: '军事国防',
  55: '视觉艺术',
  149: '影视天地',
  74: '音乐空间',
  118: '体坛风云',
  114: '文人墨客',
  334: '情系舞缘',
  140: '动漫时代',
  208: '社团交流中心',
  233: '影视资源',
  152: '体育资源',
  128: '动漫资源',
  252: '软件资源',
  229: '音乐资源',
  154: '资源工作室',
  174: '就业创业',
  199: '保研考研',
  219: '出国留学',
  430: '公考选调',
  403: '部门直通车',
  25: '水手之家',
  236: '校园热点',
  45: '情感专区',
  370: '吃喝玩乐',
  309: '成电锐评',
  225: '交通出行',
  17: '同城同乡',
  237: '毕业感言',
  109: '成电轨迹',
  326: '新生专区',
  394: '车迷内部资料',
}

const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const { state } = useAppState()

  const searchParams = new URLSearchParams(location.search)
  const searchName = searchParams.get('name')
  if (searchName) {
    pathnames.push(searchName)
  }
  return (
    <MuiBreadcrumbs>
      <StyledRouterLink color="inherit" to="/">
        首页
      </StyledRouterLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const isSecondLast = index === pathnames.length - 2

        const displayName = forumDictionary[name] || name

        if (isSecondLast) {
          return pathnames[index] !== 'search' ? null : (
            <span key={routeTo}>{displayName}</span>
          )
        }

        if (!isLast) {
          return (
            <StyledRouterLink key={routeTo} color="inherit" to={routeTo}>
              {displayName}
            </StyledRouterLink>
          )
        }

        return Number(name) > 500 ? (
          <span key={routeTo}>
            {state.selectedPost ? state.selectedPost : name}
          </span>
        ) : (
          <span key={routeTo}>{displayName}</span>
        )
      })}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
