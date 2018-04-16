import * as React from "react";

interface RequestHeadersProps {
  name: string;
  value: string;
}

export const RequestHeaderList = props => {
  return (
    <ul className="requestHeaderContainer">
      <label>Request Headers</label>
      {props.RequestHeaders.map((requestHeader: RequestHeadersProps, index: number) => {
        if (requestHeader.value && requestHeader.name) {
          return (
            <li className="requestHeader" key={index}>
              <span className="requestHeaderName">{requestHeader.name} :</span>{" "}
              <span className="requestHeaderValue">{requestHeader.value}</span>
            </li>
          );
        }
        return "";
      })}
    </ul>
  );
};
