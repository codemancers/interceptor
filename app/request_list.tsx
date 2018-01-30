/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';

const renderRequests = (requests: Array<RequestObj> = []) => {
  return requests.map((request, index:number) => {
    return( <tr key= {index}> 
      <td className="url">{request.url}</td> 
      <td className="method">{request.method}</td> 
    </tr>
    )
  });
}

export interface RequestObj { requests: Array<chrome.webRequest.WebRequestDetails> }

const RequestList = (props: RequestObj) => {
  return(
    <table>
      <thead>
        <tr>
          <th>URLs</th>
        </tr>
      </thead>
      <tbody>
        {renderRequests(props.requests)}
      </tbody>
    </table>
  );
}
export default RequestList
