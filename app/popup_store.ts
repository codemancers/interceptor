import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { Middleware } from 'react-redux/node_modules/redux';

import {reducer}  from './modules/recordings';
export interface PopUpInterface {
  enabled: boolean;
  errorMessage ?: string;
  requests?: Array<Object>;
}

const logger:Middleware = createLogger();

const middlewares = applyMiddleware(logger);
const enhancer = compose(
  middlewares
);

export default function (initalState: PopUpInterface ) {
  return createStore(reducer , initalState, enhancer);
}




