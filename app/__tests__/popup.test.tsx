///<reference path='./../../node_modules/@types/enzyme/index.d.ts'/>
///<reference path='./../../node_modules/@types/jasmine/index.d.ts'/>
///<reference path='./../../node_modules/@types/enzyme-adapter-react-15/index.d.ts'/>
///<reference path='./../../node_modules/@types/jest/index.d.ts'/>
import * as React from 'react';
import { shallow } from 'enzyme';
import {Popup} from './../popup';

import * as MessageService from '../message_service';


jest.mock('../message_service');

const commonProps =  {
  tabUrl: 'http://google.com',
  updateFields: jest.fn(),
  updateField: jest.fn(),
  clearFields : jest.fn(),
  errorNotify: jest.fn(),
  startListening : jest.fn(),
  stopListening : jest.fn(),
  tabId : 1,
  enabled : false,
  requests : [],
  errorMessage : ""
}

describe('Popup', () => {
  let wrapper:any

  describe('default state', () => {
    beforeEach(() => {
      commonProps.clearFields.mockClear()
      commonProps.updateFields.mockClear()
      commonProps.updateField.mockClear()
      commonProps.clearFields.mockClear()
      commonProps.errorNotify.mockClear()
      commonProps.startListening.mockClear()
      commonProps.stopListening.mockClear()
      wrapper = shallow(<Popup {...commonProps}  />);
    });

    test('Contains two button elements', () => {
      expect(wrapper.find('button')).toHaveLength(2);
    });

    test('should render RequestList component', () => {
      expect(wrapper.find('RequestList')).toHaveLength(1);
    });

    test('on start button click, should trigger enable message and updateField', () => {
      wrapper.find('button').first().simulate('click');
      expect(MessageService.getRequests).toHaveBeenCalled();
      expect(MessageService.enableLogging).toHaveBeenCalledWith('http://google.com', 1);
      expect(commonProps.updateFields).toHaveBeenCalledTimes(1);
    });

    test('on clear button click, should trigger clearData and clearField', () => {
      wrapper.find('.btn-clear').simulate('click');
      expect(MessageService.clearData).toHaveBeenCalledWith(1);
      expect(commonProps.clearFields).toHaveBeenCalledTimes(1);
    });
  });

  describe('on enabled', () => {
    beforeEach(() => {
      commonProps.clearFields.mockClear()
      commonProps.updateFields.mockClear()
      commonProps.updateField.mockClear()
      commonProps.clearFields.mockClear()
      commonProps.errorNotify.mockClear()
      commonProps.startListening.mockClear()
      commonProps.stopListening.mockClear()
      wrapper = shallow(<Popup {...commonProps} enabled={true} />);
    });


    test('on stop button click, should trigger disable message and updateField', () =>{
      wrapper.find('button').first().simulate('click')
      expect(commonProps.updateField).toHaveBeenCalledWith('enabled', false);
      expect(MessageService.disableLogging).toHaveBeenCalledWith('http://google.com', 1);
    });
  });

  describe('on error', () => {
    test('should render error message', () => {
      wrapper = shallow(<Popup {...commonProps } errorMessage={"Error"}  />)
      expect(wrapper.find('.popup-error-message').text()).toEqual(expect.stringMatching("Error"))
    });
  });

  describe('on invalid url', () => {
    beforeEach(() => {
      commonProps.errorNotify.mockClear()
      wrapper = shallow(<Popup {...commonProps} tabUrl={"chrome://version"} enabled={false} />)
    });
    test('should call errorNotify', () => {
      wrapper.find('button').first().simulate('click')
      expect(commonProps.errorNotify).toHaveBeenCalledWith('Cannot Start Listening on chrome://version');
    })
  });

})