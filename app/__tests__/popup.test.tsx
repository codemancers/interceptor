///<reference path='./../../node_modules/@types/enzyme/index.d.ts'/>
///<reference path='./../../node_modules/@types/jasmine/index.d.ts'/>
///<reference path='./../../node_modules/@types/enzyme-adapter-react-15/index.d.ts'/>
///<reference path='./../../node_modules/@types/jest/index.d.ts'/>
import * as React from 'react';
import { configure } from 'enzyme';
import { shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-15';
import {Popup} from './../popup';

import * as MessageService from '../message_service';

configure({ adapter: new Adapter() });

jest.mock('../message_service');

const propsMockFn = jest.fn();

const updateFieldsMock = propsMockFn
const updateFieldMock =  propsMockFn
const clearFieldsMock = propsMockFn
const errorNotifyMock = propsMockFn
const startListeningMock = propsMockFn
const stopListening = propsMockFn

const commonProps = () => {return {
  tabUrl: 'http://google.com',
  updateFields: propsMockFn,
  updateField: propsMockFn,
  clearFields : propsMockFn,
  errorNotify: propsMockFn,
  startListening : propsMockFn,
  stopListening : propsMockFn,
  tabId : 1,
  enabled : false,
  requests : [],
  errorMessage : ""
}}


describe('Popup', () => {
  let wrapper:ReactWrapper

  describe('default state', () => {
    beforeEach(() => {
      wrapper = shallow(<Popup {...commonProps() } />);
    });

    test('Contains two button elements', () => {
      expect(wrapper.find('button')).toHaveLength(2);
    });

    test('should render RequestList component', () => {
      expect(wrapper.find('RequestList')).toHaveLength(1);
    });

    test('on start button click, should trigger enable message and updateField', () => {
      wrapper.find('button').first().simulate('click');
      updateFieldsMock.mockClear()
      expect(MessageService.getRequests).toHaveBeenCalled();
      expect(MessageService.enableLogging).toHaveBeenCalledWith('http://google.com', 1);
      expect(updateFieldsMock).toHaveBeenCalledTimes(0);
    });

    test('on clear button click, should trigger clearData and clearField', () => {
      wrapper.find('.btn-clear').simulate('click');
      expect(MessageService.clearData).toHaveBeenCalledWith(1);
      expect(wrapper.clearFields).toHaveBeenCalled();
    });
  });

  describe('on enabled', () => {

    beforeEach(() => {
      wrapper = shallow(<Popup {...commonProps() } enabled={true} />);
    });


    test('on stop button click, should trigger disable message and updateField', () =>{
      wrapper.find('button').first().simulate('click')
      wrapper.updateField = jest.fn();
      expect(wrapper.updateField).toHaveBeenCalledWith('enabled', false);
      expect(MessageService.disableLogging).toHaveBeenCalledWith('http://google.com', 1);
    });
  });

  describe('on error', () => {
    let wrapper
    beforeEach (() => {
      wrapper = shallow(<Popup {...commonProps() } errorMessage={"Error"}  />)
    })
    test('should render error message', () => {
      expect(wrapper.find('.popup-error-message').text()).toEqual(expect.stringMatching("Error"))
    });
  });

  describe('on invalid url', () => {
    beforeEach(() => {
      let wrapper = shallow(<Popup {...commonProps() } tabUrl={"chrome://version"}  />)
    });
    test('should call errorNotify', () => {
      wrapper.errorNotify = jest.fn();
      expect(wrapper.errorNotify).toHaveBeenCalled();
    })
  });

})