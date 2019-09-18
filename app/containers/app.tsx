import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";
import { initialiseDefaults } from "./../actions";

import Popup from "./Popup";

const queryParams: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
};

const store = new Store({
  portName: "INTERCEPTOR"
});

chrome.tabs.query(queryParams, tabs => {
  const tab = tabs[0];
  if (!tab) return;

  const { id, url } = tab;
  if (typeof id === "undefined" || typeof url === "undefined") return;

  store.dispatch(initialiseDefaults(id, url, ""));

  store.ready().then(() => {
    render(
      <Provider store={store}>
        <Popup />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});
