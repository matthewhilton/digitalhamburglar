module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: process.env.API_ENDPOINT + '/:path*' // Proxy to Backend
        },
        {
            source: '/offerImages/:path*',
            destination: process.env.API_ENDPOINT + '/offerImages/:path*' // Proxy to Backend
          }
      ]
    }
  }