import React from 'react';
//import Watch from './watch';
import RequestList from './request_list'


const App = (props) => {
  return(
    <div>
      {/* <Watch/> */}
      <RequestList requests={props.requests}/>
    </div>
  );
}

App.defaultProps = {
  requests: []
}

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}

export default App
