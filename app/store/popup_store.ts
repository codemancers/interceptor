import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { Middleware } from 'react-redux/node_modules/redux';
import thunkMiddleware from 'redux-thunk';
// import { aliases } from './aliases'
// import { alias } from 'react-chrome-redux';

import {reducer}  from './../reducers/rootReducer';
export interface PopUpInterface {
  enabled: boolean;
  errorMessage ?: string;
  requests?: Array<Object>;
}
let enhancer:any;
if (process.env.NODE_ENV !== 'production') {
const logger:Middleware = createLogger();

enhancer = applyMiddleware(
	thunkMiddleware,
	logger
);
}

export default function (initalState: PopUpInterface ) {
  if(enhancer){
    return createStore(reducer , initalState, enhancer)
  }else{
    return createStore(reducer , initalState)
  }
}