import * as React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { InterceptForm } from "./../components/Intercept_Components";

export type onClickCallback = (e: React.MouseEvent<HTMLElement>) => void;
export interface RequestObj {
  tabRecord: any;
  requestRecords: any;
  currentTabId: number;
  handleChangeUrl: (value: string, tabId: number, index: number) => void;
  handleCheckedRequests?: (requests: Array<chrome.webRequest.WebRequestDetails>) => void;
  handleRespTextChange?: () => (value: string, reqId: string) => void;
  handleStatusCodeChange?: (value: string, reqId: string) => void;
  handleCheckToggle?: (tabId: number, reqId: number, checked: boolean) => void;
  handleContentTypeChange?: (value: string, reqId: string) => void;
  handlePaginationChange?: (rowSize: number, tabId: number, field: string) => void;
  updateInterceptorStatus?: (tabId: number) => void;
  fetchResponse: React.MouseEvent<HTMLSpanElement>;
  handleSwitchToggle: any;
  fetchFailure: any;
}
const RequestList: React.SFC<RequestObj> = props => {
  const columns = [
    {
      Header: "Request URL",
      accessor: "url",
      Cell: ({ original }: any) => (
        <div className="url" title={original.url}>
          {original.url}
        </div>
      ),
      filterable: true,
      filterMethod: (filter: any, rows: any) => {
        return matchSorter(rows, filter.value, {
          keys: ["url"],
          threshold: matchSorter.rankings.CONTAINS
        });
      },
      filterAll: true
    },
    {
      Header: "Method",
      className: "method",
      accessor: "method",
      width: 100,
      filterable: true,
      filterMethod: (filter: any, row: any) => row[filter.id] === filter.value,
      Filter: ({ filter, onChange }: any) => (
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
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
      Cell: ({ original }: any) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={props.tabRecord.checkedReqs[original.requestId]}
            onChange={e => {
              props.handleCheckToggle(props.currentTabId, original.requestId, e.target.checked);
            }}
          />
        );
      },
      Header: "Intercept",
      sortable: false,
      width: 75,
      className: "text-center"
    }
  ];

  return (
    <div>
      <ReactTable
        data={props.tabRecord.requests}
        columns={columns}
        showPagination={true}
        showPaginationTop={false}
        showPaginationBottom={true}
        defaultPageSize={10}
        page={props.tabRecord.PageDetails.currentPageNumber}
        pageSize={props.tabRecord.PageDetails.currentRowSize}
        onPageChange={changedPageNo =>
          props.handlePaginationChange(changedPageNo, props.currentTabId, "currentPageNumber")
        }
        onPageSizeChange={changedRowSize =>
          props.handlePaginationChange(changedRowSize, props.currentTabId, "currentRowSize")
        }
        collapseOnDataChange={false}
        SubComponent={row => {
          return (
            <InterceptForm
              requestRecords={props.tabRecord.requestRecords[row.original.requestId]}
              currentTabId={props.currentTabId}
              rowProps={row}
              handleStatusCodeChange={props.handleStatusCodeChange}
              handleRespTextChange={props.handleRespTextChange}
              handleContentTypeChange={props.handleContentTypeChange}
              fetchResponse={props.fetchResponse}
              index={row.index}
              handleChangeUrl={props.handleChangeUrl}
              fetchFailure={props.fetchFailure}
            />
          );
        }}
      />
    </div>
  );
};
export default RequestList;

RequestList.defaultProps = {};
