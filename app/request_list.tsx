/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';

const renderRequests = (requests: Array<RequestObj> = []) => {
  return requests.map((request, index:number) => {
    return( <tr key= {index}>
      <td className="method">{request.method}</td>
      <td className="url">{request.url}</td>
    </tr>
    )
  });
}

export interface RequestObj { requests: Array<chrome.webRequest.WebRequestDetails> }

const RequestList = (props: RequestObj) => {
  return(
    <tbody>
      {renderRequests(props.requests)}
    </tbody>
  );
}
export default RequestList
