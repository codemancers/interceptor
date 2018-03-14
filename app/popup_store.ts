import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { Middleware } from 'react-redux/node_modules/redux';

import {reducer}  from './modules/recordings';
import {alias} from 'react-chrome-redux'
import {aliases} from './aliases'
export interface PopUpInterface {
  enabled: boolean;
  errorMessage ?: string;
  requests?: Array<Object>;
}

const logger:Middleware = createLogger();

const middlewares = applyMiddleware(logger);
const aliasMiddleware = applyMiddleware(alias(aliases))
const enhancer = compose(
  middlewares,
  aliasMiddleware
);

export default function (initalState: PopUpInterface ) {
  return createStore(reducer , initalState, enhancer);
}




