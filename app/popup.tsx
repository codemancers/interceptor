import * as React from "react"
import * as ReactDOM from "react-dom"
import * as MessageService from './message_service'

const CHROME_URL_REGEX = /^chrome:\/\/.+$/;

const isChromeUrl = (url : string) => {
  return CHROME_URL_REGEX.test(url);
}

type ButtonLabel = 'Enable' | 'Disable';
interface PopupProps { enabled: boolean, tabId: number, tabUrl: string };
interface PopupState { enabled: boolean, label: ButtonLabel, errorMessage?: string };

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
    super(props);
    this.state = {
      enabled: props.enabled,
      label: props.enabled ? 'Disable' : 'Enable',
      errorMessage: ''
    };
  }

  isUrlInValid = (tabUrl : string) => {
    return !tabUrl || isChromeUrl(tabUrl);
  }

  handleClick = (_ : React.SyntheticEvent<HTMLButtonElement>) => {
    const isEnabled = this.state.enabled;
    const willBeEnabled = !isEnabled;
    const label = willBeEnabled ? 'Disable' : 'Enable';
    const { tabId, tabUrl } = this.props;

    if(this.isUrlInValid(tabUrl)) {
      this.setState({ errorMessage: `Cannot start listening on ${tabUrl}` });
      return;
    }

    const newState: PopupState = {
      enabled: willBeEnabled,
      label,
      errorMessage: ''
    };

    this.setState(newState, () => {
      if (isEnabled) {
        MessageService.enableLogging(tabUrl, tabId);
      } else {
        MessageService.disableLogging(tabUrl, tabId);
      }
    });
  }

  render () {
    const errorMessage = this.state.errorMessage;

    return (
      <div>
        {
          errorMessage
            ? <p>{errorMessage}</p>
            : null
        }
        <button type='button' onClick={this.handleClick}>
          {this.state.label}
        </button>
      </div>
    );
  }
}

const queryParams : chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
}

chrome.tabs.query(queryParams, tabs => {
  const tab = tabs[0];
  if (!tab) return;

  const { id, url } = tab;
  if (typeof id === 'undefined' || typeof url === 'undefined') return;

  MessageService.getEnabledStatusForTab(id, (enabled: boolean) => {
    ReactDOM.render(<Popup enabled={enabled} tabId={id} tabUrl={url} />, document.getElementById('root'));
  });
});
