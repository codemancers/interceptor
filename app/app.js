import React from 'react';
import Watch from './watch';

class App extends React.Component {
  constructor(props) {
    super(props);
  }


  renderRequests(requests) {
    return requests.map((request, index) => {
      return(<div key={index}>{request}</div>);
    })
  }

  render() {
    return (
      <div>
        <Watch/>
        {this.renderRequests(this.props.requests)}
        <button ref="enable">Check this page now!</button>
      </div>
    )
  }
}

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}
App.defaultProps = {
  requests: ["hello", "world"]
}

document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      var d = document;

      var f = d.createElement('form');
      f.action = 'http://gtmetrix.com/analyze.html?bm';
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = tab.url;
      f.appendChild(i);
      d.body.appendChild(f);
      f.submit();
    });
  }, false);
}, false);

export default App
