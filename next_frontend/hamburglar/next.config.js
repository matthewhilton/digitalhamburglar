module.exports = {
  async rewrites() {
    return [
      {
        // Proxy API requests to backend to prevent CORS issues
        source: '/api/:path*',
        destination: `${process.env.API_ENDPOINT}/:path*` // Proxy to Backend
      }
    ]
  }
}