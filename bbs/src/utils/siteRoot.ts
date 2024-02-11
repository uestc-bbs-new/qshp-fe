export const siteDomain = 'bbs.uestc.edu.cn'
const prefix = import.meta.env.DEV ? `https://${siteDomain}` : ''
export default prefix
