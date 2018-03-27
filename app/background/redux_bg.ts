
import {INITIAL_POPUP_STATE} from './../reducers/rootReducer'
import store from './../store/popup_store'
import {wrapStore} from 'react-chrome-redux'

const createStore = store({ ...INITIAL_POPUP_STATE });

wrapStore(createStore, {
  portName: 'INTERCEPTOR',
})
