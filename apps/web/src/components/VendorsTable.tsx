import { Dollar, Vendors } from '@app/common'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  ColumnDef,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import {
  FiArrowDown,
  FiArrowUp,
  FiExternalLink,
  FiSearch,
} from 'react-icons/fi'

import { formatDollar } from '../utils/formatDollar'
import { DebouncedInput } from './DebouncedInput'

interface Company {
  name: string
  url: string
}

interface Row {
  company: Company
  sso: {
    price: number
    url: string
  }
  plan: {
    price: number | string
    url: string
  }
  updatedAt: string
  categories: string[]
}

const columnHelper = createColumnHelper<Row>()

const PricingCell = ({
  price,
  url,
}: {
  price: number | string
  url: string
}): JSX.Element => {
  return (
    <Flex gap="2" justifyContent="flex-end">
      <Box>
        {typeof price === 'string' ? (
          <Text>{price}</Text>
        ) : price === 0 ? (
          <Tag size="sm" colorScheme="green" variant="outline">
            <TagLabel>Free</TagLabel>
          </Tag>
        ) : (
          <Text
            title={formatDollar(Dollar.fromDatabase(price), {
              withCents: true,
            })}
          >
            {formatDollar(Dollar.fromDatabase(price))}
          </Text>
        )}
      </Box>
      <Link
        rel="noreferrer noopener"
        target="_blank"
        href={url}
        display="flex"
        alignItems="center"
        mb="3px"
      >
        <Icon aria-label={`Go to ${url}`} as={FiExternalLink} />
      </Link>
    </Flex>
  )
}
interface Props {
  vendors: Vendors
}

function SortableHeader({
  isSorted,
  children,
  marginLeft,
}: {
  isSorted: string
  children: string
  marginLeft?: 'auto'
}): JSX.Element {
  return (
    <Box
      cursor="pointer"
      display="flex"
      alignItems="center"
      gap="1"
      marginLeft={marginLeft}
    >
      <Text as="span">{children}</Text>
      {{
        asc: <Icon as={FiArrowUp} color="muted" boxSize="4" />,
        desc: <Icon as={FiArrowDown} color="muted" boxSize="4" />,
      }[isSorted] ?? null}
    </Box>
  )
}

// https://codesandbox.io/s/github/tanstack/table/tree/main/examples/react/filters?from-embed
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({ itemRank })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export function VendorsTable({ vendors }: Props): JSX.Element {
  const columns: ColumnDef<Row, any>[] = useMemo(
    () => [
      columnHelper.accessor((r) => r.company.name, {
        id: 'company',
        header: ({ header }) => (
          <SortableHeader isSorted={String(header.column.getIsSorted())}>
            Company
          </SortableHeader>
        ),
        cell: ({
          row: {
            original: { company },
          },
        }) => {
          return (
            <Flex gap="2">
              <Text>{company.name}</Text>
              <Link
                href={company.url}
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <Icon aria-label={`Go to ${company.url}`} as={FiExternalLink} />
              </Link>
            </Flex>
          )
        },
      }),
      columnHelper.accessor((r) => r.sso.price, {
        id: 'sso',
        header: ({ header }) => (
          <SortableHeader
            isSorted={String(header.column.getIsSorted())}
            marginLeft="auto"
          >
            SSO Price
          </SortableHeader>
        ),
        cell: ({
          row: {
            original: { sso },
          },
        }) => <PricingCell price={sso.price} url={sso.url} />,
      }),
      columnHelper.accessor((r) => r.plan.price, {
        id: 'plan',
        header: ({ header }) => (
          <SortableHeader
            isSorted={String(header.column.getIsSorted())}
            marginLeft="auto"
          >
            Plan Price
          </SortableHeader>
        ),
        cell: ({
          row: {
            original: { plan },
          },
        }) => <PricingCell price={plan.price} url={plan.url} />,
      }),
      columnHelper.accessor((r) => r.updatedAt, {
        id: 'updatedAt',
        header: ({ header }) => (
          <SortableHeader
            isSorted={String(header.column.getIsSorted())}
            marginLeft="auto"
          >
            Updated
          </SortableHeader>
        ),
        cell: (info) => <Text align="right">{info.getValue()}</Text>,
      }),
      columnHelper.accessor((r) => r.categories.join(' '), {
        id: 'categories',
        header: 'Categories',
        enableSorting: false,
        cell: ({
          row: {
            original: { categories },
          },
        }) => (
          <HStack>
            {categories.map(
              (category): JSX.Element => (
                <Tag key={category}>{category}</Tag>
              ),
            )}
          </HStack>
        ),
      }),
    ],
    [],
  )

  const isMobile = useBreakpointValue({ base: true, md: false })

  const dataSource = useMemo(
    () =>
      vendors.map(
        (node): Row => ({
          company: {
            name: node.name,
            url: node.homepageUrl,
          },
          sso: {
            price: node.ssoPrice,
            url: node.ssoSourceUrl,
          },
          plan: {
            price: node.planPrice,
            url: node.planSourceUrl,
          },
          updatedAt: dayjs(node.updatedAt).format('ll'),
          categories: node.categories,
        }),
      ) ?? [],
    [vendors],
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: dataSource,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
  })

  return (
    <Stack>
      <Box px={{ base: '4', md: '6' }} pt="5">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="medium">
            Wall of Appreciation
          </Text>
          <InputGroup maxW="xs">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <DebouncedInput
              value={globalFilter}
              placeholder="Search"
              onChange={(e): void => setGlobalFilter(e)}
            />
          </InputGroup>
        </Stack>
      </Box>
      <TableContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.column.getCanSort() ? (
                        <Box
                          cursor="pointer"
                          display="flex"
                          alignItems="center"
                          gap="1"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </Box>
                      ) : header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box px={{ base: '4', md: '6' }} pb="5">
        <HStack spacing="3" justify="space-between">
          {!isMobile && (
            <Text color="muted" fontSize="sm">
              {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(
                1,
                table.getPageCount(),
              )}`}
            </Text>
          )}
          <ButtonGroup
            spacing="3"
            justifyContent="space-between"
            width={{ base: 'full', md: 'auto' }}
            variant="secondary"
          >
            <Button
              isDisabled={!table.getCanPreviousPage()}
              onClick={(): void => table.previousPage()}
            >
              Previous
            </Button>
            <Button
              isDisabled={!table.getCanNextPage()}
              onClick={(): void => table.nextPage()}
            >
              Next
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>
    </Stack>
  )
}
