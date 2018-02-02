/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';

interface RowProps {
  request : chrome.webRequest.WebRequestDetails,
  key : number,
  handleIntercept: React.MouseEventHandler<{}>
}

const Row = ( props: RowProps) => {
  return (<tr key={props.key}> 
      <td className="url">{props.request.url}</td> 
      <td className="method">{props.request.method}</td> 
      <td><button type="button" className="btn-clear" onClick={props.handleIntercept.bind(this, props.request.url, props.request.method, 404)}>Intercept</button></td>
    </tr>);
}

export interface RequestObj { requests: Array<chrome.webRequest.WebRequestDetails>, handleIntercept : React.MouseEventHandler<{}> }

const RequestList = (props: RequestObj) => {
  return(
    <table>
      <thead>
        <tr>
          <th>URLs</th>
          <th>Method</th>
          <th>Intercept</th>
        </tr>
      </thead>
      <tbody>
        {
          props.requests.map((requestDetail, index) => {
            return <Row request={requestDetail} key={index} handleIntercept={props.handleIntercept} />
          })
        }
      </tbody>
    </table>
  );
}
export default RequestList
