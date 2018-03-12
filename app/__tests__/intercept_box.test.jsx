import * as React from "react";
import {shallow} from "enzyme";
import { InterceptTextBox } from './../Intercept_Components/InterceptTextBox';

const createTestProps = props => ({
  // common props
  handleIntercept: jest.fn(),
  handleRespTextChange: jest.fn(),
  handleStatusCodeChange: jest.fn(),
  handleContentTypeChange: jest.fn(),
  rowProps : {
    checkbox :{
      requestId : 123
    }
  },
  ResponseText: [],
  interceptStatus: [],
  contentType: [],
  // allow to override common props
  ...props
});

describe("Intercept fields", () => {
  let wrapper, props;

  describe("Default State", () => {
    beforeEach( () => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<InterceptTextBox {...props} />)
    })

    test("it renders without crashing", () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.props).toBeDefined();
    })
  })

describe("Show default values for response, status and content-type", ()=>{
  let wrapper, props
  beforeEach( ()=> {
    jest.clearAllMocks()
    props = createTestProps()
    wrapper = shallow(<InterceptTextBox {...props} />)
  })

  test("default value for response text", ()=> {
    expect(wrapper.find(".responseText").props().value).toEqual("{msg:hello}")
  })
  test("default value for status text", ()=> {
    expect(wrapper.find(".select-status").props().value).toEqual("200")
  })
  test("default value for status text", ()=> {
    expect(wrapper.find(".content-type-select").props().value).toEqual("application/json")
  })
})

  describe("onChange events", ()=> {
    let wrapper, props
    beforeEach( () => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<InterceptTextBox {...props} /> )
    })
    test("handleRespTextChange should be called on response field change", () =>{
      wrapper.find(".responseText").first().simulate('change', { target: { value: 'h' } })
      expect(props.handleRespTextChange).toHaveBeenCalledTimes(1)
      expect(props.handleRespTextChange).toHaveBeenCalledWith('h', 123)
    })

    test("handleStatusCodeChange should be called on status field change", () =>{
      wrapper.find(".select-status").first().simulate('change', { target: { value: '404' } })
      expect(props.handleStatusCodeChange).toHaveBeenCalledTimes(1)
      expect(props.handleStatusCodeChange).toHaveBeenCalledWith("404", 123)
    })

    test("handleContentTypeChange should be called on content-type field change", () =>{
      wrapper.find(".content-type-select").first().simulate('change', { target: { value: 'text/html' } })
      expect(props.handleContentTypeChange).toHaveBeenCalledTimes(1);
      expect(props.handleContentTypeChange).toHaveBeenCalledWith("text/html", 123)
    })
  })

})