module.exports = {
    async rewrites() {
      return [
        {
            // Proxy api requests
            source: '/api/:path*',
            destination: process.env.API_ENDPOINT + '/:path*'
        },
        {
            // Proxy offer image redirects
            source: '/offerImages/:path*',
            destination: process.env.API_ENDPOINT + '/offerImages/:path*'
          }
      ]
    }
  }