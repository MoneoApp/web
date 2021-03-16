const withImages = require('next-images');

module.exports = withImages({
  esModule: true,
  fileExtensions: ['jpg', 'png'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  }
});
