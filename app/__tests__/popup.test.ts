import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils'; 
import { describe, test, expect,contains, shallow } from 'enzyme';

import  {Popup} from './../popup';

describe('Test Popup Initial state', () => {
  test('Top most component recieves three props', () => {
    const wrapper = shallow(<Popup />);
    expect(ConnectedPopup.props.length).toBe(3)
  });

  test('Connected component contains PopUp as child', () => {
    const wrapper = shallow(<Popup />)
    const button = shallow(<button />)
    expect(wrapper.contains(button)).toBeTruthy()
  })
  
})
