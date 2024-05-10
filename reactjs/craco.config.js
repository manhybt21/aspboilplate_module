const {
  when,
  whenDev,
  whenProd,
  whenCI,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require('@craco/craco');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1DA57A',
          '@link-color': '#1DA57A',
        },
      },
    },
  ],
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
            },
            {
              from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
              to: 'dist/abp.signalr-client.js',
            },
            {
              from: 'src/lib/abp.js',
            },
          ],
        })
      );

      return webpackConfig;
    },
  },
};
