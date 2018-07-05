import * as React from "react";
import { shallow } from "enzyme";
import { AddRuleModal } from "./../components/AddRuleModal";

const createTestProps = props => ({
  handleClose: jest.fn(),
  addRequestMethod: "GET",
  addRequest: jest.fn(),
  addRequestUrl: "http://www.codemancers.com",
  updateAddRequestMethod: jest.fn(),
  updateAddRequestUrl: jest.fn(),
  addRuleErrorNotify:jest.fn(),
  tabId: 4545
  // allow to override common props
  ...props
});

describe("AddRuleModal component test", () => {
  const wrapper, props;
  beforeEach(() => {
    jest.clearAllMocks();
    props = createTestProps();
    wrapper = shallow(<AddRuleModal {...props} />);
  });

  describe("default", () => {
    test("Contains a Modal HOC component", () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.find("Modal")).toHaveLength(1);
    });
    test("Contains a input, select and a button element", () => {
      expect(wrapper.find("input")).toHaveLength(1);
      expect(wrapper.find("select")).toHaveLength(1);
      expect(wrapper.find("button")).toHaveLength(1);
    });
  });
    describe("onChange and click events", () => {

    test("onChange url input", () => {
      wrapper
        .find("input")
        .first()
        .simulate("change", { target: { value: "a" } });
      expect(props.updateAddRequestUrl).toHaveBeenCalledTimes(1);
    });
    test("onChange method input", ()=> {
      wrapper
      .find("select")
      .first()
      .simulate("change", { target: { value: "a" } });
    expect(props.updateAddRequestMethod).toHaveBeenCalledTimes(1);
    });

    test("onClick of addRule button and for Valid URL, props.addRequest must be called with proper params and reset fields", ()=> {
      wrapper
      .find(".btn-add-rule")
      .first()
      .simulate("click");
    //to clear out the earlier error message
    expect(props.addRuleErrorNotify).toHaveBeenCalledWith("", 4545)
    expect(props.addRequest).toHaveBeenCalledTimes(1);
    expect(props.addRequest).toHaveBeenCalledWith("http://www.codemancers.com", "GET")
    //to reset url and method fields to empty strings
    expect(props.updateAddRequestUrl).toHaveBeenCalledWith("",4545)
    expect(props.updateAddRequestMethod).toHaveBeenCalledWith("GET", 4545)
    });

    test("onClick of addRule button and for Valid URL, props.addRuleErrorNotify must be called", ()=> {
      const wrapperWithInvalidUrl = shallow(<AddRuleModal {...props} addRequestUrl="www.codemancers.com" /> );
      wrapperWithInvalidUrl
      .find(".btn-add-rule")
      .first()
      .simulate("click");
    expect(props.addRuleErrorNotify).toHaveBeenCalled();
    expect(props.addRuleErrorNotify).toHaveBeenCalledWith("Please Enter a valid URL", 4545)
    });
})

