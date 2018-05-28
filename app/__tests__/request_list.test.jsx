import * as React from "react";
import { shallow } from "enzyme";
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
  handleSwitch: jest.fn(),
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

  test("Only one ReactTable component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);
    expect(wrapper.find("ReactTable")).toHaveLength(1);
  });

  test("One InterceptButton component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);
    expect(wrapper.find("InterceptAllButton")).toHaveLength(1);
  });

  test("on clear button click, should trigger clearData and clearField", () => {
    wrapper
      .find(".btn-clear")
      .first()
      .simulate("click");
    expect(commonProps.clearRequests).toHaveBeenCalledTimes(1);
  });
});
