module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'Shopping List',
    themeColor: '#1976d2',
    msTileColor: '#1976d2',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/service-worker.js',
      // ...other Workbox options...
    },
    manifestOptions: {

    },
    manifestPath: 'manifest.json',
    iconPaths: {
      favicon32: 'src/assets/icons/favicon-32x32.png',
      favicon16: 'src/assets/icons/favicon-16x16.png',
      appleTouchIcon: 'src/assets/icons/favicon-128x128.png',
      maskIcon: null,
      msTileImage: 'src/assets/icons/favicon-128x128.png'
    }
  }
}