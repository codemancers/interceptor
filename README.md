# Interceptor

[WIP] A chrome extension that mocks AJAX request at the browser level so you
can run front ends without really starting a backend server.

## Development

```
$ npm install
$ npm run watch
# Install "./dist" directory as "unpacked chrome extension" (google it!)
```

## Status

Currently it just shows the count of total AJAX requests in a small badge
like this: ![image](https://cloud.githubusercontent.com/assets/1707078/14903635/0127b5d0-0dc0-11e6-8698-bb998d91a178.png)

It also shows a list of detected XHR request URLs in the extension popup like this:
![image](https://cloud.githubusercontent.com/assets/1707078/15038793/98b02366-12c4-11e6-944b-259a89c4c133.png)

## TODO

* A user should be able to click on the extension button and see a popup with a list of all AJAX requests.
* A user should be able to "watch" ajax requests using a URL pattern.
* If watched requests are in pre-flight, block everything and ask the user how to handle it.
* The user may choose to let the request pass through or fill in mock response using a form.
* Persist settings for each URL in localStorage.
* Mocked requests should hit a sinon fakeServer.
* User should be able to disable/enable mocking for a page without clearing persisted settings for the URL.
