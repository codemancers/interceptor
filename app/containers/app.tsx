import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Store } from "react-chrome-redux";

// components
import Popup from "./popup";

const queryParams: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
};

const store = new Store({
  state: {},
  portName: "INTERCEPTOR"
});

chrome.tabs.query(queryParams, tabs => {
  const tab = tabs[0];
  if (!tab) return;

  const { id, url } = tab;
  if (typeof id === "undefined" || typeof url === "undefined") return;

  store.ready().then(() => {
    render(
      <Provider store={store}>
        <Popup tabUrl={url} tabId={id} />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
  });
});
