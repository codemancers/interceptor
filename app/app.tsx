import * as React from 'react';
import RequestList, { RequestObj } from './request_list'

export interface AppProps { requests: Array<RequestObj> }

const App = (props: AppProps) => <RequestList requests={props.requests} />

export default App
