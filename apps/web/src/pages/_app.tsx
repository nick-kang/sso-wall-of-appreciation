// eslint-disable-next-line
import '@fontsource/inter/variable.css'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import dayjs from 'dayjs'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { useMemo } from 'react'

import theme from '../styles/theme'
import { hostname } from '@app/common'

dayjs.extend(localizedFormat)

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()
  const canonicalUrl = useMemo(
    () => hostname + (router.asPath === '/' ? '' : router.asPath).split('?')[0],
    [router.asPath],
  )
  const rum = useAnalytics()

  useEffect(() => {
    rum?.recordPageView(canonicalUrl)
  }, [rum, canonicalUrl])

  return (
    <>
      <DefaultSeo
        canonical={canonicalUrl}
        defaultTitle="SSO Wall of Appreciation"
        description="A list of vendors that recognize SSO is a core security feature that should be offered at a reasonable price."
      />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default MyApp
