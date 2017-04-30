import { createStore } from 'redux'

// Reducer
function requestReducer(state=[], action) {
  switch (action.type) {
    case 'ADD_REQUEST':
      return state.concat(action.request)
    case 'CLEAR_REQUESTS':
      return [];
    default:
      return state;
  }
}

export const initializeStore = function(requests) {
  return createStore(requestReducer, requests);
}
