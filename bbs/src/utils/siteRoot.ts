export const siteDomain = 'bbs.uestc.edu.cn'
const prefix = import.meta.env.DEV ? `https://${siteDomain}` : ''
export default prefix

export const isVpnProxy = // @ts-expect-error preserve code as is
  !!(window.vpnGlobal && window.__vpn_hostname_data == 'webvpn.uestc.edu.cn')
