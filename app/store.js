import { createStore } from 'redux'

// Reducer
function requestReducer(state=[], action) {
  switch (action.type) {
    case 'ADD_REQUEST':
      return state.concat(action.request)
    default:
      return state;
  }
}

export var requestStore = createStore(requestReducer);
