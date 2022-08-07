// @ts-check
import base from '@app/config-esbuild'
import esbuild from 'esbuild'

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: [
    'src/index.ts',
    'src/MyGitHubActionRole.ts',
    'src/renameHtmlFiles.ts',
  ],
  external: ['aws-cdk-lib'],
  format: 'cjs',
  minify: false,
  outdir: 'build',
  outfile: undefined,
}

esbuild.build({ ...base, ...config }).catch((e) => {
  console.error(e)
  process.exit(1)
})
