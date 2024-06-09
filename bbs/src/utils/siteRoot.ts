export const siteDomain = 'bbs.uestc.edu.cn'
const prefix = import.meta.env.DEV ? `https://${siteDomain}` : ''
export default prefix

export const isVpnProxy = // @ts-expect-error preserve code as is
  window[['L'.toLowerCase(), 'ocation'].join('')].hostname ==
  `bbs-uestc-edu-cn-s.vpn.uestc.edu.cn`
