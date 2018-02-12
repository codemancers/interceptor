import * as React from 'react';
import { shallow } from 'enzyme';
import RequestList from './../request_list'

const commonProps = {
  handleIntercept : jest.fn(),
  requests : []
}
let wrapper:any
let RowComponent:any

describe('RequestList initial state', () => {
  beforeEach( () => {
    commonProps.handleIntercept.mockClear()
    wrapper = shallow(<RequestList {...commonProps} />)
  })
  test('Request list must be empty', () => {
    expect(commonProps.requests).toHaveLength(0)
  })
  test('Intercept button should not be called', () => {
    expect(commonProps.handleIntercept).toHaveBeenCalledTimes(0)
  })
})

const rowCommonProps = {
  keyValue : 0,
  request : {},
  handleIntercept : jest.fn()
}

describe('Row component initial state' , () => {
  RowComponent = shallow(<Row {...rowCommonProps} />)
  beforeEach( () => {
    rowCommonProps.handleIntercept.mockClear()
  })
  test('Row should be empty', () => {
    expect(rowCommonProps.request).toEqual({});
  })
})

describe('Row component on request arrival', () => {
  beforeEach(() => {
    RowComponent = shallow(<Row {...rowCommonProps} request={{url : 'http://www.codemancers.com', method : 'GET', keyValue : 1}} />)
    rowCommonProps.handleIntercept.mockClear();
  })
  test('should display correct url', () => {
    expect(RowComponent.find('.url').first().text()).toEqual(expect.stringContaining('codemancers'))
  })
  test('should display correct method', () => {
    expect(RowComponent.find('.method').first().text()).toEqual(expect.stringContaining('GET'))
  })
  test('should have a length of 1', () => {
    expect(RowComponent).toHaveLength(1)
  })
})