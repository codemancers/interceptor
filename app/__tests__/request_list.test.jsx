import * as React from "react";
import { shallow } from "enzyme";
import RequestList from "./../request_list";

const commonProps = {
  handleIntercept: jest.fn(),
  requests: [],
  PageDetails : {
    100 : {
      currentPageNumber : 0,
      currentRowSize : 10
    },
    101 : {
      currentPageNumber : 1,
      currentRowSize : 5
    }
  },
  tabId : 100
};
let wrapper;
let RowComponent;

describe("RequestList initial state", () => {
  beforeEach(() => {
    commonProps.handleIntercept.mockClear();
    wrapper = shallow(<RequestList {...commonProps} />);
  });
  test("Request list must be empty", () => {
    expect(commonProps.requests).toHaveLength(0);
  });

  test("Only one ReactTable component should be present", () => {
    wrapper = shallow(<RequestList {...commonProps} />);

    expect(wrapper.find("ReactTable")).toHaveLength(1);
  });
});