import * as React from "react";
import { shallow } from "enzyme";
import AddRuleModal  from "../components/AddRuleModal";

const addRequest = jest.fn();
const resetAddRequest = jest.fn();
const updateRequestRootFields = jest.fn();

const createTestProps = props => ({
  addRequestDetails:{ fields : {url : "http://www.codemancers.com", method: "GET"}, error: ""},
  updateAddRequestFields: jest.fn(),
  handleClose: jest.fn(),
  addRequest,
  resetAddRequest,
  updateRequestRootFields,
  tabId: 4545,
  // allow to override common props
  ...props
});

describe("<AddRuleModal />", () => {
  const wrapper, props;
  beforeEach(() => {
    jest.clearAllMocks();
    props = createTestProps();
    wrapper = shallow(<AddRuleModal {...props} />);
  });

  describe("renders all components without error", () => {
    test("Contains a Modal HOC component", () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.find("Modal")).toHaveLength(1);
    });

    test("Contains a input, select and two button element", () => {
      expect(wrapper.find("input")).toHaveLength(1);
      expect(wrapper.find("select")).toHaveLength(1);
      expect(wrapper.find("button")).toHaveLength(2);
    });

    test('on mount should reset the fields', () =>{
      wrapper = shallow(<AddRuleModal {...props} />, { disableLifecycleMethods: false });
      expect(resetAddRequest).toBeCalled();
    });
  });

  describe("onChange and click events", () => {
    test("onChange url input", () => {
      wrapper
        .find("input")
        .first()
        .simulate("change", { target: { value: "a", name: "url" } });
      expect(props.updateAddRequestFields).toHaveBeenCalledWith({"url": "a"})
    });

    test("onChange method input", ()=> {
      wrapper
        .find("select")
        .first()
        .simulate("change", { target: { value: "POST", , name: "method" } });
      expect(props.updateAddRequestFields).toHaveBeenCalledWith({"method": "POST"})
    });

    test("on valid URL, clicking on add rule should call addRequest", ()=> {
      wrapper
        .find(".btn-add-rule")
        .first()
        .simulate("click");
      expect(props.addRequest).toHaveBeenCalledTimes(1);
    });

    test("onInvalid Url, clicking on add rule should update error message", ()=> {
      const addRequest = {
        ...props.addRequestDetails,
        fields: {
          ...props.addRequestDetails.fields,
          url: 'aaaa',
        }
      };
      const wrapperWithInvalidUrl = shallow(<AddRuleModal {...props} addRequestDetails={addRequest} />);
      wrapperWithInvalidUrl
        .find(".btn-add-rule")
        .first()
        .simulate("click");
      expect(props.addRequest).not.toBeCalled();
      expect(props.updateRequestRootFields).toHaveBeenCalledWith({"error": "Please Enter a valid URL"})
    });
  });
});
