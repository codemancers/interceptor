import * as React from "react";
import { shallow, mount } from "enzyme";
import RequestList from "./../components/RequestList";

const commonProps = {
  tabRecord: {
    PageDetails: [],
    checkedReqs: {},
    enabledStatus: true,
    errorMessage: "",
    interceptStatus: "",
    isInterceptorOn: true,
    requests: []
  },
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

  test("Only one ReactTable component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);
    expect(wrapper.find("ReactTable")).toHaveLength(1);
  });
});

describe("on Click Events", () => {
  const wrapper;
  beforeEach(() => {
    wrapper = shallow(<RequestList {...commonProps} />);
    jest.clearAllMocks();
  });
});
