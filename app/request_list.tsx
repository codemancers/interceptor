/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from "react";
import ReactTable from "react-table";
import * as matchSorter from "match-sorter";
import {InterceptForm} from "./Intercept_Components";
export interface RequestObj {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
  handleCheckToggle: React.ChangeEvent<HTMLInputElement>;
  handleCheckedRequests:React.MouseEventHandler<HTMLButtonElement>
  checkedReqs : Array<any>
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
          onChange={event => onChange(event.target.value)}
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
      Cell: ({original}) => {
        const presentReqId = (props, rowReqId) => {
          let RequestId = -1;
          props.requests.map( (request, index:number) => {
            if(request.requestId === rowReqId){
              RequestId = rowReqId
            }
          })
          return RequestId
        }
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={() => {
              const clickedReqId = presentReqId(props, original.requestId);
            }}
            onChange={(e) => {
              const clickedReqId = presentReqId(props, original.requestId)
              props.handleCheckToggle(clickedReqId, e.target.checked)}
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
            let requestsToSend:Array<any> = []
            data.map((requestItem:any) => {
              if(props.checkedReqs[requestItem.checkbox.requestId]){
                requestsToSend.push(requestItem.checkbox)
              }
            })
            props.handleCheckedRequests(requestsToSend)
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
      SubComponent={row => (
        <InterceptForm rowProps={row} handleIntercept={props.handleIntercept} />
      )}
    />
  );
};
export default RequestList;
