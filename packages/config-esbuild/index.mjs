// @ts-check
/** @type {import('esbuild').BuildOptions} */
const baseOptions = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'esm',
  incremental: Boolean(process.env.WATCH),
  keepNames: true,
  legalComments: 'none',
  minify: true,
  outfile: 'build/index.js',
  platform: 'node',
  sourcemap: 'linked',
  sourcesContent: false,
  target: 'esnext',
  watch: Boolean(process.env.WATCH),
}

export default baseOptions
