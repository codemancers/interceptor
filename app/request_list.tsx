/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';


const renderRequests = (requests: Array<chrome.webRequest.WebRequestDetails> = []) => {
  return requests.map((request:chrome.webRequest.WebRequestDetails, index:number) => {
    return( <tr key= {index}> 
      <td className="url">{request.url}</td> 
      <td className="method">{request.method}</td> 
    </tr>
    )
  });
}

export interface RequestListProps { requests: Array<any> }

const RequestList = (props: any) => {
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
