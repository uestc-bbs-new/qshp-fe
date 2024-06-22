import boat from '@/assets/404/boat.png'
import bg from '@/assets/404/sky_bg.png'
import waveBack from '@/assets/404/wave_back.png'
import waveFront from '@/assets/404/wave_front.png'
import { isIdasRelease } from '@/utils/releaseMode'

const NotFound = () => {
  return (
    <div
      css={{
        zIndex: -1,
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <img
        src={bg}
        css={{
          width: '100%',
          height: '100%',
        }}
      />
      <img
        src={waveBack}
        css={{ position: 'absolute', width: '100%', left: 0, bottom: 0 }}
      />
      <img
        src={boat}
        css={{
          position: 'absolute',
          width: (664 / 1920) * 100 + 'vw',
          right: (123 / 1920) * 100 + 'vw',
          bottom: (140 / 1920) * 100 + 'vw',
          '@media (min-width: 1920px)': {
            width: '664px',
          },
          '@media (max-width: 800px)': {
            width: '65%',
          },
        }}
      />
      <img
        src={waveFront}
        css={{ position: 'absolute', width: '100%', left: 0, bottom: 0 }}
      />
      <div
        css={{
          position: 'absolute',
          left: (280 / 1920) * 100 + 'vw',
          bottom: ((isIdasRelease ? 560 : 404) / 1920) * 100 + 'vw',
          color: '#DD8837',
          fontWeight: 600,
          '@media (max-width: 800px)': {
            bottom: 'auto',
            top: '35%',
            left: 0,
            right: 0,
            textAlign: 'center',
          },
        }}
      >
        {isIdasRelease ? (
          <div
            css={{
              fontSize: (64 / 1920) * 100 + 'vw',
              lineHeight: 1.5,
              '@media (min-width: 1920px)': {
                fontSize: '64px',
              },
              '@media (max-width: 800px)': {
                fontSize: '32px',
              },
              '@media (max-width: 600px)': {
                fontSize: '7vw',
              },
            }}
          >
            新版河畔暂未上线，
            <br />
            敬请期待……
          </div>
        ) : (
          <>
            <div
              css={{
                fontSize: (320 / 1920) * 100 + 'vw',
                lineHeight: 1,
                '@media (min-width: 1800px)': {
                  fontSize: '300px',
                },
                '@media (max-width: 800px)': {
                  fontSize: '132px',
                },
                '@media (max-width: 600px)': {
                  fontSize: '40vw',
                },
              }}
            >
              404
            </div>
            <div
              css={{
                fontSize: (64 / 1920) * 100 + 'vw',
                lineHeight: 1,
                '@media (min-width: 1920px)': {
                  fontSize: '64px',
                },
                '@media (max-width: 800px)': {
                  fontSize: '32px',
                },
                '@media (max-width: 600px)': {
                  fontSize: '7vw',
                },
              }}
            >
              该页面无法找到……
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default NotFound
