import * as React from 'react'
import { InterceptTextBox } from './InterceptTextBox';
import { InterceptStatusCode } from './InterceptStatusCode';

export const InterceptForm = (props) => {
  return(
    <div>
    <InterceptTextBox rowProps={props.rowProps.row} handleIntercept={props.handleIntercept} handleResponseStatus={props.handleResponseTextChange}/>
    <InterceptStatusCode handleResponseStatus={props.handleResponseStatus}/>
    </div>
  )
}