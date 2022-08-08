import { Box, Text } from '@chakra-ui/react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

import { useAnalytics } from '../hooks/useAnalytics'

interface Props {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: Props): JSX.Element {
  const analytics = useAnalytics()
  return (
    <ReactErrorBoundary
      onError={(e): void => analytics?.recordError(e)}
      FallbackComponent={(): JSX.Element => (
        <Box
          w="full"
          h="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>Something went wrong. Please try refreshing.</Text>
        </Box>
      )}
    >
      {children}
    </ReactErrorBoundary>
  )
}
