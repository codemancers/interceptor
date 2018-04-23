import * as React from "react";

interface RequestHeadersProps {
  name: string;
  value: string;
}

export const RequestHeaderList = props => {
  return (
    <div className="requestHeaderContainer">
      <label>Request Headers</label>
      <ul>
        {props.requestHeaders.map((requestHeader: RequestHeadersProps, index: number) => {
          if (requestHeader.value && requestHeader.name) {
            return (
              <li className="requestHeader" key={index}>
                <span className="requestHeaderName">{requestHeader.name} :</span>{" "}
                {requestHeader.name === "Cookie" ? (
                  <span className="cookie">{requestHeader.value}</span>
                ) : (
                  <span className="requestHeaderValue">{requestHeader.value} </span>
                )}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};

RequestHeaderList.defaultProps = {
  requestHeaders: []
};
