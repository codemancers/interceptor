/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from "react";
import ReactTable from "react-table";
import * as matchSorter from "match-sorter";
import {InterceptForm} from "./Intercept_Components";
export interface RequestObj {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
  handleCheckToggle: React.ChangeEvent<HTMLInputElement>;
  handleCheckedRequests:React.MouseEventHandler<HTMLButtonElement>;
  handleRespTextChange : React.FormEvent<HTMLInputElement>;
  handleStatusCodeChange: React.FormEvent<HTMLSelectElement>;
  checkedReqs : Array<any>;
  ResponseText: Array<any>
  interceptStatus : Array<any>
}
const RequestList = (props: RequestObj) => {
  const columns = [
    {
      Header: "Request URL",
      accessor: "url",
      filterable: true,
      filterMethod: (filter, rows) => {
        return matchSorter(rows, filter.value, {
          keys: ["url"],
          threshold: matchSorter.rankings.CONTAINS
        });
      },
      filterAll: true
    },
    {
      Header: "Method",
      accessor: "method",
      filterable: true,
      filterMethod: (filter, row) => row[filter.id] === filter.value,
      Filter: ({filter, onChange}) => (
        <select
          onChange={event => props.handleRespTextChange(event.target.value)}
          style={{width: "100%"}}
          value={filter ? filter.value : ""}
        >
          <option value="">ALL</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      )
    },
    {
      id: "checkbox",
      accessor: "",
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={props.checkedReqs[original.requestId]}
            onChange={(e) => {
              props.handleCheckToggle(original.requestId, e.target.checked)}
            }
          />
        );
      },
      Header: "Intercept",
      sortable: false,
      width: 45,
      Footer: ({data}) =>(
        <span>
          <button id="intercept-all-btn" onClick={() => {
            const enabledRequests = data.filter((request) => {
              return props.checkedReqs[request.checkbox.requestId]
            })
            .map(request => request.checkbox);
            props.handleCheckedRequests(enabledRequests)
          }}>Intercept All</button>
        </span>
      )
    }
  ];
  return (
    <ReactTable
      data={props.requests}
      columns={columns}
      showPagination={true}
      showPaginationTop={false}
      showPaginationBottom={true}
      pageSize={10}
      freezeWhenExpanded
      SubComponent={row => (
        <InterceptForm freezeWhenExpanded={true} rowProps={row} handleIntercept={props.handleIntercept} handleStatusCodeChange={props.handleStatusCodeChange} handleRespTextChange={props.handleRespTextChange} ResponseText={props.ResponseText}
        interceptStatus={props.interceptStatus} />
      )}
    />
  );
};
export default RequestList;
