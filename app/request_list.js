import React from 'react';

var renderRequests = function(requests) {
  return requests.map(function(request){
    return <tr>{request.url}</tr>
  });
}

const RequestList = (props) => {
  return(
    <table>
      <thead>
        <tr>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        {renderRequests(props.requests)}
      </tbody>
    </table>
  );
}

export default RequestList
