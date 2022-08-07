export function assertNever(value: never): never {
  throw new Error('Unreachable code: ' + JSON.stringify(value))
}
