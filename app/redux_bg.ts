
import {INITIAL_POPUP_STATE} from './modules/recordings'
import store from './popup_store'
import {wrapStore} from 'react-chrome-redux'

const createStore = store({ ...INITIAL_POPUP_STATE });

wrapStore(createStore, {
  portName: 'INTERCEPTOR',
})
