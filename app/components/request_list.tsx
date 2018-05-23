import * as React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { InterceptForm } from "./../components/Intercept_Components/index";
import { InterceptAllButton } from "./../components/InterceptAllButton";
import { Switch } from "./Switch";
// import { responseField, statusCodes, contentType } from "./../content/content";
// import { interceptOn } from "./../types";

export type onClickCallback = (e: React.MouseEvent<HTMLElement>) => void;
export interface RequestObj {
  data: any;
  currentTabId: number;
  requestId?: number;
  url?: string;
  method?: string;
  rowProps?: any;
  handleCheckedRequests?: (requests: Array<chrome.webRequest.WebRequestDetails>) => void;
  handleRespTextChange?: () => (value: string, reqId: string) => void;
  handleStatusCodeChange?: (value: string, reqId: string) => void;
  handleCheckToggle?: (tabId: number, reqId: number, checked: boolean) => void;
  handleContentTypeChange?: (value: string, reqId: string) => void;
  handlePaginationChange?: (rowSize: number, tabId: number, field: string) => void;
  clearRequests?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  updateInterceptorStatus?: (tabId: number) => void;
  fetchResponse: React.MouseEvent<HTMLSpanElement>;
  handleSwitch: any;
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
            checked={props.data.checkedReqs[original.requestId]}
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
  const enabledRequests = props.data.requests.filter(
    (request: chrome.webRequest.WebRequestFullDetails) => {
      return props.data.checkedReqs[request.requestId];
    }
  );

  return (
    <div>
      <div className="grid-container response-action">
        <Switch isOn={props.data.isInterceptorOn} handleSwitch={props.handleSwitch} />
        <div className="text-right">
          <InterceptAllButton
            disabled={!enabledRequests.length}
            handleCheckedRequests={() => {
              return props.handleCheckedRequests(enabledRequests);
            }}
          />
          <button
            type="button"
            title="Clear All Requests"
            className="btn btn-sm btn-primary btn-clear"
            onClick={props.clearRequests}
          >
            CLEAR
          </button>
        </div>
      </div>

      <ReactTable
        data={props.data.requests}
        columns={columns}
        showPagination={true}
        showPaginationTop={false}
        showPaginationBottom={true}
        defaultPageSize={10}
        page={props.data.PageDetails ? props.data.PageDetails.currentPageNumber : 0}
        pageSize={props.data.PageDetails ? props.data.PageDetails.currentRowSize : 10}
        onPageChange={changedPageNo =>
          props.handlePaginationChange(changedPageNo, props.currentTabId, "currentPageNumber")
        }
        onPageSizeChange={changedRowSize =>
          props.handlePaginationChange(changedRowSize, props.currentTabId, "currentRowSize")
        }
        collapseOnDataChange={false}
        SubComponent={row => (
          <InterceptForm
            data={props.data}
            currentTabId={props.currentTabId}
            rowProps={row}
            handleStatusCodeChange={props.handleStatusCodeChange}
            handleRespTextChange={props.handleRespTextChange}
            handleContentTypeChange={props.handleContentTypeChange}
            fetchResponse={props.fetchResponse}
          />
        )}
      />
    </div>
  );
};
export default RequestList;

RequestList.defaultProps = {};
