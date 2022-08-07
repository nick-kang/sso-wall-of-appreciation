const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatterWithCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatDollar(
  val: number,
  { withCents }: { withCents?: boolean } = {},
): string {
  return withCents ? formatterWithCents.format(val) : formatter.format(val)
}
