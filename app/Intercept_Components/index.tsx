import * as React from 'react'
import { InterceptTextBox } from './InterceptTextBox';
import { InterceptStatusCode } from './InterceptStatusCode';

export const InterceptForm = (props) => {
  return(
    <div>
    <InterceptTextBox rowProps={props.rowProps.row} handleIntercept={props.handleIntercept} handleRespTextChange={props.handleRespTextChange} ResponseText={props.ResponseText} />
    <InterceptStatusCode rowProps={props.rowProps.row} handleStatusCodeChange={props.handleStatusCodeChange} interceptStatus={props.interceptStatus} />
    </div>
  )
}