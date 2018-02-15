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
  test("Intercept button should not be called", () => {
    expect(commonProps.handleIntercept).toHaveBeenCalledTimes(0);
  });
});

describe("RequestList on request arrival", () => {
  beforeEach(() => {
    commonProps.handleIntercept.mockClear();
    wrapper = shallow(
      <RequestList
        {...commonProps}
        requests={[
          {
            url: "http://www.codemancers.com",
            method: "GET",
            requestId: 1
          }
        ]}
      />
    );
  });
});

describe("react-table initial state", () => {
  beforeEach(() => {
    commonProps.handleIntercept.mockClear();
  });
  test("Only one ReactTable component should be present", () => {
    expect(wrapper.find("ReactTable")).toHaveLength(1);
  });
  test("Intercept button should not be called", () => {
    expect(commonProps.handleIntercept).toHaveBeenCalledTimes(0);
  });
  test("No. of requests should be 1", () => {
    let myWrapper = shallow(
      <RequestList
        {...commonProps}
        requests={[{ url: "http://www.codemancers.com", method: "GET" }]}
      />
    );
    expect(myWrapper.prop("requests")).toHaveLength(1);
  });
});
