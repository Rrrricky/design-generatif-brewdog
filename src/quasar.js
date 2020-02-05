import Vue from 'vue'

import './styles/quasar.scss'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
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
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
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
