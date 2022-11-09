/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//         // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
//         config.resolve.fallback = {
//             fs: false
//         }
//     }
//     return config;
// }

}

module.exports = nextConfig
