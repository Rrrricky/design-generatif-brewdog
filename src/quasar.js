import Vue from 'vue'

import './styles/quasar.scss'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar,
  QBtn,
  QIcon,
  QBadge,
  QSlider,
  QDialog,
  QCard,
  QCardActions,
  QCardSection,
  ClosePopup,
  QSpace,
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    QBtn,
    QIcon,
    QBadge,
    QSlider,
    QDialog,
    QCard,
    QCardActions,
    QCardSection,
    QSpace,
  },
  directives: {
    ClosePopup
  },
  plugins: {
  }
})
