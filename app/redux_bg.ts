
import {INITIAL_POPUP_STATE} from './modules/recordings'
import store from './popup_store'
import {wrapStore} from 'react-chrome-redux'

const createStore = store({ ...INITIAL_POPUP_STATE });

wrapStore(createStore, {
  portName: 'INTERCEPTOR',
})
<<<<<<< HEAD
=======

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === "complete"){
    chrome.tabs.sendMessage(tabId, {message : "PAGE_REFRESHED", tabId})
  }
});
>>>>>>> 2b92a5ae1f67b2cf3c2097558640a7676dc76909
