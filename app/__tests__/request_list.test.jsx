import * as React from "react";
import { shallow, mount } from "enzyme";
import RequestList from "./../components/RequestList";

const commonProps = {
  tabRecord: {
    PageDetails: [],
    checkedReqs: {},
    contentType: {},
    enabledStatus: true,
    errorMessage: "",
    interceptStatus: "",
    isInterceptorOn: true,
    requests: [],
    responseData: {},
    responseError: {},
    responseText: {},
    statusCodes: {}
  },
  clearRequests: jest.fn(),
  currentTabId: 2328,
  fetchResponse: jest.fn(),
  handleCheckToggle: jest.fn(),
  handleCheckedRequests: jest.fn(),
  handleContentTypeChange: jest.fn(),
  handlePaginationChange: jest.fn(),
  handleRespTextChange: jest.fn(),
  handleStatusCodeChange: jest.fn(),
  handleSwitchToggle: jest.fn(),
  updateInterceptorStatus: jest.fn()
};
let wrapper;
let RowComponent;

describe("RequestList initial state", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallow(<RequestList {...commonProps} />);
  });
  test("Request list must be empty", () => {
    expect(commonProps.tabRecord.requests).toHaveLength(0);
  });

  test("Should contain one Switch component", () => {
    expect(wrapper.find("Switch")).toHaveLength(1);
  });

  test("Only one ReactTable component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);
    expect(wrapper.find("ReactTable")).toHaveLength(1);
  });

  test("One InterceptButton component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);
    expect(wrapper.find("InterceptAllButton")).toHaveLength(1);
  });

  test("Should contain one Clear button", () => {
    expect(wrapper.find(".btn-clear")).toHaveLength(1);
  });
});

describe("on Click Events", () => {
  const wrapper;
  beforeEach(() => {
    wrapper = shallow(<RequestList {...commonProps} />);
    jest.clearAllMocks();
  });

  test("on clear button click, should trigger props.clearRequests", () => {
    wrapper
      .find(".btn-clear")
      .first()
      .simulate("click");
    expect(commonProps.clearRequests).toHaveBeenCalledTimes(1);
  });
});
