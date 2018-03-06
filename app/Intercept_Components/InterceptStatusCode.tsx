import * as React from 'react'

export const InterceptStatusCode = props => {
  const checkValueExists = (index) => {
    if(props.interceptStatus[index]){
      return props.interceptStatus[index]
    }else{
      return "404"
    }
  }
  return (
    <div>
    <select
      value={checkValueExists(props.rowProps._index)}//props.interceptStatus[props.rowProps._index] ? props.interceptStatus[props.rowProps._index] : "404"}
      onChange={event => {props.handleStatusCodeChange(event.target.value, props.rowProps._index)}
      style={{width: "100%"}}
    >
      <option value="200">OK</option>
      <option value="404">404</option>
      <option value="500">500</option>
      <option value="300">300 Redirect</option>
    </select>
    </div>
  );
};