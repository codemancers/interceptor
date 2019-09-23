import { createStore, applyMiddleware, Middleware, combineReducers } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import aliases from "./aliases";
import { alias } from "webext-redux";
import { reducer as rootReducer } from "./../reducers/rootReducer";
import { addRequestReducer } from "../reducers/addRequest";
import { POPUP_PROPS } from "../types";

let enhancer: any;
if (process.env.NODE_ENV !== "production") {
  const logger: Middleware = createLogger({
    collapsed: true
  });
  enhancer = applyMiddleware(alias(aliases), thunkMiddleware, logger);
} else {
  enhancer = applyMiddleware(alias(aliases), thunkMiddleware);
}
export default function(initalState: POPUP_PROPS) {
  return createStore(combineReducers({ rootReducer, addRequestReducer }), initalState, enhancer);
}
