import * as React from "react";
import {shallow} from "enzyme"
import { InterceptAllButton } from "./../components/InterceptAllButton";

const interceptAllButtonProps = {
  disabled: true;
  handleCheckedRequests: jest.fn();
};

describe("<InterceptAllButton /> initial state", () => {
  let InterceptAllButtonWrapper;
  beforeEach(() => {
    jest.clearAllMocks();
    InterceptAllButtonWrapper = shallow(<InterceptAllButton {...interceptAllButtonProps} />);
  });

  test("InterceptAllButton renders without crashing", () => {
    expect(InterceptAllButtonWrapper).toBeDefined();
    expect(InterceptAllButtonWrapper.props)
      .toBeDefined();
  });

  test("It contains one button element", ()=> {
    expect(InterceptAllButtonWrapper.find("button")).toHaveLength(1)
  })
});

describe("<InterceptAllButton /> onClick events", ()=> {
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<InterceptAllButton {...interceptAllButtonProps} />);
    jest.clearAllMocks()
  })

  test("onClick of button, should trigger props.handleCheckedRequests", ()=> {
    wrapper.find('button').simulate("click");
    expect(interceptAllButtonProps.handleCheckedRequests).toBeCalled()
  })
})
