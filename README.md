# Interceptor

A browser extension that mocks AJAX request at the browser level so you
can run front ends without really starting a backend server.

Firefox : https://addons.mozilla.org/en-US/firefox/addon/xhr-interceptor/

Chrome : https://chrome.google.com/webstore/detail/interceptor/enenfaicdcfgcnjmiigcjbmlbaoapnen

## Development

```
$ yarn install
$ npm run watch
# Install "./dist" directory as "unpacked chrome extension" (google it!)
```

## Status

Once you open the extension popup, it shows a UI as seen below. By default, `Intercept Mode` is `ON`.

<img src="images/interceptor_ui.png" alt="Interceptor extension default popup">

Once you start listening, it shows the count of total AJAX requests in a small badge and list of incoming `XHR` requests
in the popup like this:

<img src="images/interceptor_ui_xhr_list.png" alt="Interceptor extension popup showing a list of AJAX requests">

You can click the small arrow beside the URL and specify a response to mock, when the same request is encountered next:

<img src="images/interceptor_textfields.png" alt="Specify mock responses using Interceptor as shown">

You can specify the [Content-Type header][content-type] field and HTTP response [status code][status-code] through the dropdown available.

Once the above fields are filled and checkbox is checked, click the `INTERCEPT` button. If the interception is successfull, it shows a success message as below:

<img src="images/intercept_success.png" alt="Success message shown by Interceptor upon sucessful interception">

You can intercept/mock multiple calls by checking as many checkboxes as you want

<img src="images/intercept_multiple_xhr.png" alt="Success message shown by Interceptor upon sucessful interception">

Henceforth the same AJAX request is requested by the browser, the browser is given a fake/mock response instead of the real one.

You can also stop listening for `AJAX calls` by clicking the `STOP LISTENING`

The toggle switch is used to disable `INTERCEPTOR`. If the toggle is switched to `OFF` state,
the extension will not mock any previously intercepted calls.

To mock the calls again, just toggle the switch to `ON` state, check the requests that are to be mocked and click `INTERCEPT` button.

## TODO

* ~~A user should be able to click on the extension button and see a popup with a list of all AJAX requests.~~
* A user should be able to "watch" ajax requests using a URL pattern.
* If watched requests are in pre-flight, block everything and ask the user how to handle it.
* ~~The user may choose to let the request pass through or fill in mock response using a form.~~
* Persist settings for each URL in localStorage.
* ~~Mocked requests should hit a sinon fakeServer.~~
* User should be able to disable/enable mocking for a page without clearing persisted settings for the URL.

## License

MIT

[content-type]: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
[status-code]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status