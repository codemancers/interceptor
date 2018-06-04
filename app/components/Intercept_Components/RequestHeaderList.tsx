import * as React from "react";

interface requestHeadersProps extends chrome.webRequest.WebRequestHeadersDetails {
  map: Function;
}

interface RequestHeadersProps {
  name: string;
  value: string;
  requestHeaders: requestHeadersProps;
}

export const RequestHeaderList: React.SFC<RequestHeadersProps> = props => {
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

RequestHeaderList.displayName = "RequestHeaderList";

RequestHeaderList.defaultProps = {
  name: "",
  value: "",
  requestHeaders: []
};
