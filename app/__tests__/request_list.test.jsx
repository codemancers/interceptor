import * as React from "react";
import { shallow } from "enzyme";
import RequestList from "./../request_list";

const commonProps = {
  handleIntercept: jest.fn(),
  requests: []
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