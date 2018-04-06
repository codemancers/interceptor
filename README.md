# Interceptor

A chrome extension that mocks AJAX request at the browser level so you
can run front ends without really starting a backend server.

## Development

```
$ yarn install
$ npm run watch
# Install "./dist" directory as "unpacked chrome extension" (google it!)
```

## Status

Once you start listening, it shows the count of total AJAX requests in a small badge and list of incoming `XHR` requests
in the popup like this:

<img src="https://raw.githubusercontent.com/code-mancers/interceptor/Update-readme/images/interceptor_ui.png" alt="Interceptor extension popup showing a list of AJAX requests">

You can click the small arrow beside the URL and specify a response to mock the next time the same request comes in as below:

<img src="https://raw.githubusercontent.com/code-mancers/interceptor/Update-readme/images/interceptor_textfields.png" alt="Specify mock responses using Interceptor as shown">

You can specify the [Content-Type header][content-type] field and HTTP response [status code][status-code] through the dropdown available.

Once the above fields are filled and checkboxes checked, click the `INTERCEPT` button. If the interception is successfull, it shows a success message as below:

<img src="https://raw.githubusercontent.com/code-mancers/interceptor/Update-readme/images/intercept_success.png" alt="Success message shown by Interceptor upon sucessful interception">


Henceforth the same AJAX request is requested by the browser, the browser is given a fake/mock response instead of the real one.

## TODO

* ~~A user should be able to click on the extension button and see a popup with a list of all AJAX requests.~~
* A user should be able to "watch" ajax requests using a URL pattern.
* If watched requests are in pre-flight, block everything and ask the user how to handle it.
* The user may choose to let the request pass through or fill in mock response using a form.
* Persist settings for each URL in localStorage.
* ~~Mocked requests should hit a sinon fakeServer.~~
* User should be able to disable/enable mocking for a page without clearing persisted settings for the URL.

[content-type]: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
[status-code]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status