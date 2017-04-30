import * as React from 'react';

// TODO: Find out what type a request is, if possible
export interface RequestObj { url: string, request: any }

const renderRequests = (requests: Array<RequestObj>) =>
  requests.map((request, index) =>
    <tr key={index}>{request.url}</tr>
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
