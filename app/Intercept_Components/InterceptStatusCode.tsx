import * as React from 'react'

export const InterceptStatusCode = props => {
  return (
    <div>
    <select
      // onChange={event => onChange(event.target.value)}
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