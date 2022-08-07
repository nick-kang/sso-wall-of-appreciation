import read from 'fs-readdir-recursive'
import fs from 'node:fs'
import path from 'node:path'

const OLD_PATH = path.join('apps/web/out')
const NEW_PATH = path.join('apps/web/html')

// removes `.html` extension from NextJS output. Required for Cloudfront/S3 hosting because Cloudfront doesn't transform the referrer url to include the `.html` extension for S3. By removing the `.html` extension, referrer url will match S3 object.
export function main(): void {
  const filenames = read(
    OLD_PATH,
    (name, _, dir) => name.endsWith('.html') && !dir.startsWith('_next'),
  )

  fs.mkdirSync(NEW_PATH)

  for (const filename of filenames) {
    const oldFilePath = path.join(OLD_PATH, filename)
    const newFilePath = path.join(
      NEW_PATH,
      filename.substring(0, filename.lastIndexOf('.')),
    )

    fs.renameSync(oldFilePath, newFilePath)
  }
}

main()
