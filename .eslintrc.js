module.exports = {
  root: true,
  extends: ['@app/eslint-config'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
