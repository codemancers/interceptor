/// <reference path="../node_modules/@types/chrome/chrome-app.d.ts" />
import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

interface RowProps {
  request : chrome.webRequest.WebRequestDetails,
  keyValue : number,
  handleIntercept: React.MouseEventHandler<{}>
}

export interface RequestObj { requests: Array<chrome.webRequest.WebRequestDetails>, handleIntercept : React.MouseEventHandler<{}> }

 const RequestList = (props: RequestObj) => {
  function timeFormatter(cell, row) {
    if (row.timeStamp) {
      return new Date(row.timeStamp).toTimeString()
    }

    return ({ cell });
  }
  function addButton() {
      return <button onClick={props.handleIntercept}>Intercept</button>
    }
  interface methodInterface {
    GET : string;
    POST : string;
    OPTIONS : string;
    PUT : string
  }
  const methodSelectOptions:methodInterface = {
    'GET' : 'GET',
    'POST' : 'POST',
     'OPTIONS': 'OPTIONS',
    'PUT' : 'PUT'
  };
  return(
    <BootstrapTable
      keyField='requestId'
      filter={ filterFactory()}
      pagination={ paginationFactory() }
      cellEdit={ cellEditFactory({
        mode: 'dbclick',
        blurToSave: true,
        beforeSaveCell: (oldValue, newValue, row, column) => { console.log("oldValue::", oldValue,"newValue::", newValue, "row::",row, "column::", column)}
      }) }
      data={ props.requests}
      columns = {[
        {text : 'URLs', dataField : 'url', editable: true,
         filter : textFilter(),
         events: {
          onClick: (e) => {console.log(e)}
        }},
        {text : 'Method', dataField : 'method',filter : selectFilter({ options: methodSelectOptions}) },
        {text : 'Request Id', dataField : 'requestId', filter:textFilter()},
        {text : 'Time', dataField :'timeStamp', formatter: timeFormatter, sort : true, clickToSelect: true},
        {text : 'Intercept', dataField : " ", formatter : addButton, editable: false }
      ]}
      striped
      hover
      condensed
      handleIntercept={props.handleIntercept}
      />
  );
}
export default RequestList