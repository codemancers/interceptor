import * as React from "react";
import { shallow } from "enzyme";
import { AddRuleModal } from "./../components/AddRuleModal";

const createTestProps = props => ({
  handleClose: jest.fn(),
  showModal: false,
  modalMethod: "GET",
  addRequest: jest.fn(),
  modalUrl: "www.codemancers.com",
  updateModalMethod: jest.fn(),
  updateModalUrl: jest.fn()
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
      expect(wrapper.find("input")).toBeTruthy();
      expect(wrapper.find("select")).toBeTruthy();
      expect(wrapper.find("button")).toBeTruthy();
    });
  });
    describe("onChange and click events", () => {

    test("onChange url input", () => {
      wrapper
        .find("input")
        .first()
        .simulate("change", { target: { value: "a" } });
      expect(props.updateModalUrl).toHaveBeenCalledTimes(1);
    });
    test("onChange method input", ()=> {
      wrapper
      .find("select")
      .first()
      .simulate("change", { target: { value: "a" } });
    expect(props.updateModalMethod).toHaveBeenCalledTimes(1);
    });

    test("onClick of addRule button, props.addRequest must be called", ()=> {
      wrapper
      .find(".btn-add-rule")
      .first()
      .simulate("click");
    expect(props.addRequest).toHaveBeenCalledTimes(1);
    expect(props.addRequest).toBeCalledWith("www.codemancers.com", "GET")
    });
})
