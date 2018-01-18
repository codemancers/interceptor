/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';

// TODO: Find out what type a request is, if possible
export type RequestObj = chrome.webRequest.WebRequestBodyDetails;

const renderRequests = (requests: Array<RequestObj>) =>
  requests.map((request, index) => {
    return( <tr key= {index}> 
      <td>{request.url}</td> 
      <td>{request.method}</td> 
    </tr>
    )
  }
  );

export interface RequestListProps { requests: Array<RequestObj> }

const RequestList = (props: RequestListProps) => {
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
