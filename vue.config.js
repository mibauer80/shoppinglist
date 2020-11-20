module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'Shopping List',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'dev/sw.js',
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