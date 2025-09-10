import { Grid } from '@mui/material'

import Link from '@/components/Link'

type AdItem = {
  image?: string
  href?: string
}

const Ad = ({ mb, singleColumn }: { mb?: number; singleColumn?: boolean }) => {
  const adData: AdItem[] = []
  if (Date.now() <= new Date(2025, 9 - 1, 25, 23, 59, 59, 999).getTime()) {
    adData.push({
      image: 'https://bbs.uestc.edu.cn/data/attachment/common/fe/20250911_.jpg',
      href: '/thread/2362573',
    })
  }

  if (adData.length % 2 == 1) {
    adData.push({})
  }
  if (!adData.length) {
    return <></>
  }
  return (
    <Grid container spacing={2} mb={mb}>
      {adData
        .filter((item) => !singleColumn || !!item.image || !!item.href)
        .map((item, index) => (
          <Grid item xs={singleColumn ? 12 : 6} key={index}>
            <Link
              sx={(theme) => ({
                display: 'block',
                border: `2px solid ${
                  theme.palette.mode == 'dark' ? '#444' : '#ddd'
                }`,
                paddingTop: (79 / 618) * 100 + '%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              })}
              style={{
                backgroundImage: `url(${item.image})`,
              }}
              to={item.href}
            />
          </Grid>
        ))}
    </Grid>
  )
}

export default Ad
