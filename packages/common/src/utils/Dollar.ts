export const Dollar = {
  toDatabase: (num: number): number => num * 100,
  fromDatabase: (num: number): number => num / 100,
}
