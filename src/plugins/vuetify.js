// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#009FE4',
          secondary: '#93C14E',
          light: '#B0B0B0',
          lighter:'#D9D9D9',
          dark: '#585858',
          white: '#FFFFFF',
          error: '#FF0000',
          warning: '#FFA500',
          alert: '#FFFF00',
        }
      },
    },
  },
})