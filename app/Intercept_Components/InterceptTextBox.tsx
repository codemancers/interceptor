import * as React from 'react'

export const InterceptTextBox = props => {
  let responseText = "{msg:hello}";
  const checkValueExists = (index) => {
    if(props.ResponseText[index]){
      return props.ResponseText[index]
    }else{
      return responseText
    }
  }
  return (
    <div>
      <input
      name="responseText"
      type="text"
      value={ checkValueExists(props.rowProps._index)}
      onChange={event => props.handleRespTextChange(event.target.value, props.rowProps._index)}
    />
      <button
        value="Intercept"
        onClick={props.handleIntercept.bind(
          this,
          props.rowProps.url,
          props.rowProps.method,
          checkValueExists(props.rowProps._index),
          200
        )
      }
      >
        Intercept
      </button>
    </div>
  );
};