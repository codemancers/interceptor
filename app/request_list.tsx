/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from "react";
import ReactTable from "react-table";
import * as matchSorter from "match-sorter";
import {InterceptForm} from "./Intercept_Components";
export interface RequestObj {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  selectedReqIds:Array<number>
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
  handleCheckToggle: React.ChangeEvent<HTMLInputElement>;
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
          value={filter ? filter.value : "all"}
        >
          <option value="all">ALL</option>
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
        const presentReqId = (props, original) => {
          let RequestId = -1;
          props.requests.map( (request, index:number) => {
            if(request.requestId === original.requestId){
              RequestId = original.requestId
            }
          })
          return RequestId
        }

        const checkedBool = (thisrequestId, selectedReqIdArray) => {
          let checkedBool
          selectedReqIdArray.map((item) => {
            if(item === thisrequestId){
              checkedBool = true
            }
          })
          if(checkedBool) {
            return true
          }else{
            return false
          }

        }

        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={checkedBool(original.requestId, props.selectedReqIds) || false}
            onChange={(e) => {
              const clickedReqId = presentReqId(props, original )
              props.handleCheckToggle(clickedReqId, e.target.checked)}}
          />
        );
      },
      Header: "Intercept",
      sortable: false,
      width: 45,
      Footer: (data) => {
      }
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
