// @ts-check
const tm = require('next-transpile-modules')
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: Boolean(process.env.ANALYZE),
})
const withTm = tm(['@app/common'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
    reactRemoveProperties: true,
  },
  compress: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withBundleAnalyzer(withTm(nextConfig))
