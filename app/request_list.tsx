import * as React from 'react';

export interface RequestObj { url: string }

var renderRequests = function(requests: Array<RequestObj>) {
  return requests.map(function(request, index){
    return <tr key={index}>{request.url}</tr>
  });
}

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
