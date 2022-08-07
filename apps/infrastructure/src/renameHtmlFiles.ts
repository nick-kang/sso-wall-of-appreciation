import read from 'fs-readdir-recursive'
import fs from 'node:fs'
import path from 'node:path'

const BASE_PATH = path.join('apps/web/out')

// removes `.html` extension from NextJS output. Required for Cloudfront/S3 hosting because Cloudfront doesn't transform the referrer url to include the `.html` extension for S3. By removing the `.html` extension, referrer url will match S3 object.
export function main(): void {
  const filenames = read(
    BASE_PATH,
    (name, _, dir) => name.endsWith('.html') && !dir.startsWith('_next'),
  )

  for (const filename of filenames) {
    const filePath = path.join(BASE_PATH, filename)
    fs.renameSync(filePath, filePath.substring(0, filePath.lastIndexOf('.')))
  }
}

main()
