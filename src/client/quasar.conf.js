let path = require('path')
module.exports = function () {
  return {
    boot: [
      'i18n',
      'axios',
      'authentication'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons',
      'fontawesome-v5'
    ],

    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QImg',
        'QForm',
        'QInput',
        'QToggle',
        'QSpinnerGears',
        'QSpinnerHourglass',
        'QSpinner',
        'QTabs',
        'QRouteTab',
        'QBtnDropdown',
        'QLinearProgress',
        'QSelect',
        'QPageScroller',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QTabPanels',
        'QTabPanel',
        'QCard',
        'QTab',
        'QSplitter',
        'QSeparator',
        'QBadge',
        'QInnerLoading',
        'QDialog',
        'QCardSection',
        'QSpace',
        'QCardActions',
        'QSlider'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Cookies',
        'Loading'
      ],
      config: {
        loading: 'QSpinnerHourglass'
      }
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|src)/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '~': path.resolve(__dirname, './src'),
          '@root': path.resolve(__dirname, './../../'),
          '@shared': path.resolve(__dirname, './../shared')
        }
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: 'all',

    ssr: {
      pwa: false
    },

    pwa: {
      manifest: {
        // name: 'pasta-demo',
        // short_name: 'pasta-demo',
        // description: 'This is project for pasta-demo',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {},

    electron: {
      extendWebpack() {},

      packager: {},

      builder: {}
    }
  }
}
