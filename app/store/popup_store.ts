import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { Middleware } from 'react-redux/node_modules/redux';

import {reducer}  from './../reducers/rootReducer';
export interface PopUpInterface {
  enabled: boolean;
  errorMessage ?: string;
  requests?: Array<Object>;
}
let enhancer:any;
if (process.env.NODE_ENV !== 'production') {
const logger:Middleware = createLogger();

const middlewares = applyMiddleware(logger);
enhancer = compose(
  middlewares
);
}

export default function (initalState: PopUpInterface ) {
  if(enhancer){
    return createStore(reducer , initalState, enhancer)
  }else{
    return createStore(reducer , initalState)
  }
}