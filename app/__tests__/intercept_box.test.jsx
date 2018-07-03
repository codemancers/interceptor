import * as React from "react";
import { shallow } from "enzyme";
import { InterceptTextBox } from "./../components/Intercept_Components/InterceptTextBox";

const createTestProps = (props = {}) => ({
  // common props
  currentTabId: 2347,
  requestRecords: {
    contentType: "",
    responseError: "",
    responseText: "",
    serverError: "",
    serverResponse: "",
    statusCode: ""
  },
  fetchResponse: jest.fn(),
  handleContentTypeChange: jest.fn(),
  handleRespTextChange: jest.fn(),
  handleStatusCodeChange: jest.fn(),
  rowProps: {
    checkbox: { requestId: 123 }
  },
  fetchFailure: jest.fn()
  ...props
});
// allow to override common props

describe("Input and select Field tests", () => {
  let wrapper, props;
  describe("Default State", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<InterceptTextBox {...props} />);
    });

    test("it renders without crashing", () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.props).toBeDefined();
    });
    test("it contains one input element", () => {
      expect(wrapper.find(".responseText")).toHaveLength(1);
    });
    test("It containts a select element to change status", () => {
      expect(wrapper.find(".select-status")).toHaveLength(1);
    });
    test("It contains a select element to change content-type", () => {
      expect(wrapper.find(".content-type-select")).toHaveLength(1);
    });
    test("It contains one RequestHeaderList component", () => {
      expect(wrapper.find("RequestHeaderList")).toHaveLength(1);
    });
  });

  describe("Show default values for response, status and content-type", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<InterceptTextBox {...props} />);
    });

    test("default value for response text", () => {
      expect(wrapper.find(".responseText").props().defaultValue).toEqual("");
    });
    test("default value for status text", () => {
      expect(wrapper.find(".select-status").props().value).toEqual("200");
    });
    test("default value for status text", () => {
      expect(wrapper.find(".content-type-select").props().value).toEqual("application/json");
    });
  });

  describe("onChange events", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<InterceptTextBox {...props} />);
    });
    test("handleRespTextChange should be called on response field change", () => {
      wrapper.find(".responseText").simulate("change", { target: { value: "h" } });
      expect(props.handleRespTextChange).toHaveBeenCalledWith("h", 123, 2347);
    });
    test("handleStatusCodeChange should be called on status field change", () => {
      wrapper.find(".select-status").simulate("change", { target: { value: "404" } });
      expect(props.handleStatusCodeChange).toHaveBeenCalledWith("404", 123, 2347);
    });
    test("handleContentTypeChange should be called on content-type field change", () => {
      wrapper.find(".content-type-select").simulate("change", { target: { value: "text/html" } });
      expect(props.handleContentTypeChange).toHaveBeenCalledWith("text/html", 123, 2347);
    });
    test("props.fetchResponse and should be called on Fetch Response button click and error message should be cleared", () => {
      wrapper.find(".fetch-responsetext").simulate("click");
      expect(props.fetchFailure).toHaveBeenCalledWith("", 123 , 2347);
      expect(props.fetchResponse).toHaveBeenCalledWith({ requestId: 123 }, 2347);
    });
  });
});
