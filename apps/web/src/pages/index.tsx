import { Vendor, Vendors } from '@app/common'
import { Box, Container, Link, Text } from '@chakra-ui/react'
import camelcaseKeys from 'camelcase-keys'
import { GetStaticProps } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

import { AnonymousRequestForm } from '../components/AnonymousRequestForm'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Footer } from '../components/Footer'
import { Newsletter } from '../components/Newsletter'
import { VendorsTable } from '../components/VendorsTable'

interface Props {
  vendors: Vendors
  categories: string[]
  alternativeTo: string[]
}

export default function Root({
  vendors,
  categories,
  alternativeTo,
}: Props): JSX.Element {
  return (
    <Box mt={{ base: '5', sm: '10', md: '16' }}>
      <Container as="section" mb={{ base: '7', md: '16' }}>
        <Text
          bgGradient="linear(to-l, teal.400, blue.600)"
          bgClip="text"
          fontSize={{
            base: '4xl',
            sm: '5xl',
            md: '6xl',
          }}
          fontWeight="extrabold"
          as="h1"
          mb="5"
          textAlign="center"
        >
          SSO Wall of Appreciation
        </Text>
        <Text
          as="h2"
          fontSize={{ base: 'lg', sm: 'xl' }}
          maxW="60ch"
          textAlign="center"
          mx="auto"
        >
          A list of vendors that recognize SSO as a core security feature that
          should be offered at a reasonable price. Inspired by the{' '}
          <Link
            href="http://sso.tax/"
            rel="noreferrer noopener"
            target="_blank"
          >
            SSO Wall of Shame
          </Link>
          .
        </Text>
      </Container>
      <Container as="section" mb={{ base: '50px', md: '75px' }}>
        <ErrorBoundary>
          <VendorsTable vendors={vendors} />
        </ErrorBoundary>
      </Container>
      <Box
        as="section"
        bg="gray.50"
        py={{ base: '50px', md: '75px' }}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Text
          bgGradient="linear(to-l, teal.400, blue.600)"
          bgClip="text"
          fontSize={{
            base: '3xl',
            sm: '4xl',
            md: '5xl',
          }}
          fontWeight="extrabold"
          as="h3"
          mb="5"
          textAlign="center"
        >
          Contributors Welcome!
        </Text>
        <Container maxW="container.sm" mx="auto">
          <ErrorBoundary>
            <AnonymousRequestForm
              categories={categories}
              alternativeTo={alternativeTo}
            />
          </ErrorBoundary>
        </Container>
      </Box>
      <Container
        as="section"
        py={{ base: '50px', md: '75px' }}
        maxW="container.md"
        mx="auto"
      >
        <ErrorBoundary>
          <Newsletter />
        </ErrorBoundary>
      </Container>
      <Container
        as="section"
        pt={{ base: '2', md: '4' }}
        pb={{ base: '16px', md: '8px' }}
      >
        <Footer />
      </Container>
    </Box>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const BASE_PATH = path.join('../../_vendors')
  const filenames = fs.readdirSync(BASE_PATH)

  const vendors: Vendors = []
  const categories = new Set<string>()
  const alternativeTo = new Set<string>()
  for (const filename of filenames) {
    const rawYaml = fs.readFileSync(path.join(BASE_PATH, filename), {
      encoding: 'utf8',
    })
    const parsedYaml = YAML.parse(rawYaml)

    const vendorEither = Vendor.safeParse(camelcaseKeys(parsedYaml))

    if (!vendorEither.success) {
      throw new Error(
        JSON.stringify({
          message: `Unable to parse ${filename}`,
          error: vendorEither.error,
        }),
      )
    }

    vendors.push(vendorEither.data)
    vendorEither.data.categories.forEach((category) => categories.add(category))
    vendorEither.data.alternativeTo.forEach((alternative) =>
      alternativeTo.add(alternative),
    )
  }

  return {
    props: {
      vendors: vendors.sort(
        (a, b): number =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
      categories: Array.from(categories).sort(),
      alternativeTo: Array.from(alternativeTo).sort(),
    },
  }
}
