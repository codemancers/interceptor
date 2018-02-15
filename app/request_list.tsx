/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from "react";
import ReactTable from "react-table";
import * as matchSorter from "match-sorter";
export interface RequestObj {
  requests: Array<chrome.webRequest.WebRequestDetails>;
  handleIntercept: React.MouseEventHandler<HTMLButtonElement>;
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
      Filter: ({ filter, onChange }) => (
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "all"}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      )
    },
    {
      Header: "Intercept",
      filterable: false,
      Cell: cellInfo => (
        <button
          onClick={props.handleIntercept(
            cellInfo.row.url,
            cellInfo.row.method,
            200
          )}
        >
          Intercept
        </button>
      )
    },
    {
      Header: "Request ID",
      accessor: "requestId",
      filterable: true
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
      handleIntercept={props.handleIntercept}
    />
  );
};
export default RequestList;
