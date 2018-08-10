import * as React from "react";
import { shallow } from "enzyme";
import AddRuleModal  from "./../components/AddRuleModal";

const createTestProps = props => ({
  addRequestDetails:{ fields : {modal_url : "http://www.codemancers.com", modal_method: "GET", modal_error:""}},
  updateAddRequestFields: jest.fn(),
  handleClose: jest.fn(),
  updateRequest: jest.fn(),
  tabId: 4545,
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
    test("Contains a input, select and two button element", () => {
      expect(wrapper.find("input")).toHaveLength(1);
      expect(wrapper.find("select")).toHaveLength(1);
      expect(wrapper.find("button")).toHaveLength(2);
    });
  });
    describe("onChange and click events", () => {

    test("onChange url input", () => {
      wrapper
        .find("input")
        .first()
        .simulate("change", { target: { value: "a" } });
      expect(props.updateAddRequestFields).toHaveBeenCalledTimes(2);
      expect(props.updateAddRequestFields).toHaveBeenCalledWith({"modal_url": "a"})
    });
    test("onChange method input", ()=> {
      wrapper
      .find("select")
      .first()
      .simulate("change", { target: { value: "POST" } });
    expect(props.updateAddRequestFields).toHaveBeenCalledTimes(2);
    expect(props.updateAddRequestFields).toHaveBeenCalledWith({"modal_method": "POST"})
    });

    test("onClick of addRule button and for Valid URL, props.addRequest must be called with proper params", ()=> {
      wrapper
      .find(".btn-add-rule")
      .first()
      .simulate("click");
    expect(props.updateRequest).toHaveBeenCalledTimes(1);
    });

    test("onClick of addRule button and for invalid URL, props.addRuleErrorNotify must be called", ()=> {
      const wrapperWithInvalidUrl = shallow(<AddRuleModal {...props} addRequestDetails={{fields : {url : "www.codemancers.com", method: "GET", error:""}}} />    );
      wrapperWithInvalidUrl
      .find(".btn-add-rule")
      .first()
      .simulate("click");
    expect(props.updateRequest).toHaveBeenCalledTimes(0);
    expect(props.updateAddRequestFields).toHaveBeenCalled();
    expect(props.updateAddRequestFields).toHaveBeenCalledWith({"modal_error": "Please Enter a valid URL"})
    });
})

