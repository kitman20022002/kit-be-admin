const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // ... other webpack config
  plugins: [
    // ... other plugins
    new CopyPlugin({
      patterns: [
        { from: 'src/app/database/seed/post', to: 'app/database/seed/post' },
      ],
    }),
  ],
};