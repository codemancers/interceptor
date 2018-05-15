import {createStore, applyMiddleware} from "redux";
import {createLogger} from "redux-logger";
import {Middleware} from "react-redux/node_modules/redux";
import thunkMiddleware from "redux-thunk";
import aliases from "./aliases";
import {alias} from "react-chrome-redux";
import {reducer} from "./../reducers/rootReducer";
export interface PopUpInterface {
  enabled: boolean;
  errorMessage?: string;
  requests?: Array<Object>;
}
let enhancer: any;
if (process.env.NODE_ENV !== "production") {
  const logger: Middleware = createLogger({
    collapsed: true
  });
  enhancer = applyMiddleware(alias(aliases), thunkMiddleware, logger);
} else {
  enhancer = applyMiddleware(alias(aliases), thunkMiddleware);
}
export default function(initalState: PopUpInterface) {
  return createStore(reducer, initalState, enhancer);
}
