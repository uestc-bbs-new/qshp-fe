import { Grid } from '@mui/material'

import Link from '@/components/Link'

type AdItem = {
  image?: string
  href?: string
}

const Ad = ({ mb, singleColumn }: { mb?: number; singleColumn?: boolean }) => {
  const adData: AdItem[] = [
    // {
    //   image:
    //     'https://bbs.uestc.edu.cn/',
    //   href: 'https://bbs.uestc.edu.cn/',
    // },
  ].slice()
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
              sx={{
                display: 'block',
                border: '2px solid #ddd',
                paddingTop: (79 / 618) * 100 + '%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
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
