module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'Shopping List',
    themeColor: '#FFFFFF',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',


    manifestOptions: {
      icons: [
        {
            'src': './img/icons/android-chrome-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
        },
        {
            'src': './img/icons/android-chrome-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
        },
        {
          'src': './img/icons/apple-touch-icon.png',
          'sizes': '180x180',
          'type': 'image/png',
      },
        {
          "src": "./img/icons/maskable_icon.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
    ],
    start_url: '/'
    },
    manifestPath: 'manifest.json',
    iconPaths: {
      favicon48: 'img/icons/favicon-48x48.png',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/favicon-128x128.png',
      maskIcon: 'img/icons/maskable_icon.png',
      msTileImage: null,
    }
  }
}