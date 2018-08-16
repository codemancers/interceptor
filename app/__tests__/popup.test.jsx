import * as React from "react";
import { shallow, mount } from "enzyme";
import { Popup } from "./../containers/Popup";

import * as MessageService from "../message_service";

jest.mock("../message_service");
const createTestProps = props => ({
  tabRecord: {
    PageDetails: [],
    checkedReqs: {},
    enabledStatus: false,
    errorMessage: "",
    interceptStatus: "",
    isInterceptorOn: true,
    requests: []
  },
  showAddRuleModal: true,
  addRequestDetails: { fields: { url: "codemancers.com", method: "GET", error: "" } },
  currentTab: 1,
  currentUrl: "http://www.google.com",
  clearFields: jest.fn(),
  handleCheckToggle: jest.fn(),
  handleCheckedRequests: jest.fn(),
  handleContentTypeChange: jest.fn(),
  errorNotify: jest.fn(),
  handlePaginationChange: jest.fn(),
  handleRespTextChange: jest.fn(),
  handleStatusCodeChange: jest.fn(),
  toggleListeningRequests: jest.fn(),
  updateInterceptorStatus: jest.fn(),
  clearFields: jest.fn(),
  toggleAddRequestForm: jest.fn(),
  updateAddRequestFields: jest.fn(),
  resetAddRequest: jest.fn(),
  // allow to override common props
  ...props
});

describe("Popup", () => {
  let wrapper, props;

  describe("default state", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      props = createTestProps();
      wrapper = shallow(<Popup {...props} />);
    });

    test("it renders without crashing", () => {
      expect(wrapper).toBeDefined();
    });

    test("Contains one Logo component", () => {
      expect(wrapper.find("Logo")).toHaveLength(1);
    });

    test("Contains one button elements", () => {
      expect(wrapper.find(".btn-secondary")).toHaveLength(1);
    });

    test("Should contain one Switch component", () => {
      expect(wrapper.find("Switch")).toHaveLength(1);
    });

    test("One InterceptButton component should be present", () => {
      expect(wrapper.find("InterceptAllButton")).toHaveLength(1);
    });

    test("Should contain one Clear button", () => {
      expect(wrapper.find(".btn-clear")).toHaveLength(1);
    });

    test("Contains one RequestList component", () => {
      expect(wrapper.find("RequestList")).toHaveLength(1);
    });

    test("On start button click, should pass message 'EnableLogging' with tabId", () => {
      wrapper
        .find(".button-start-listening")
        .first()
        .simulate("click");
      expect(MessageService.enableLogging).toHaveBeenCalledWith(1);
    });
    test("contains a AddRuleModal HOC component", () => {
      expect(wrapper.find("AddRuleModal")).toHaveLength(1);
    });
  });

  describe("On enabled", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("on Stop button click, should pass message 'disableLogging' with tabId", () => {
      let localProps = createTestProps({ tabRecord: { enabledStatus: true } });
      wrapper = shallow(<Popup {...localProps} />);
      wrapper
        .find(".button-stop-listening")
        .first()
        .simulate("click");
      expect(MessageService.disableLogging).toHaveBeenCalledWith(1);
    });
  });

  describe("On error", () => {
    test("should render error message", () => {
      jest.clearAllMocks();
      let localProps = createTestProps({ tabRecord: { errorMessage: "Error" } });
      wrapper = shallow(<Popup {...localProps} />);
      expect(wrapper.find(".popup-error-message").text()).toEqual(expect.stringMatching("Error"));
    });
  });

  describe("On invalid url", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should call errorNotify and disable interception", () => {
      let localProps = createTestProps({
        currentUrl: "chrome://version"
      });
      wrapper = shallow(<Popup {...localProps} />);
      wrapper
        .find(".button-start-listening")
        .first()
        .simulate("click");
      expect(localProps.errorNotify).toHaveBeenCalledWith(
        "Cannot Start Listening on chrome://version",
        1
      );
    });
  });

  describe("Intercept Success Message", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("Should display Success message on successfull intercept", () => {
      let localProps = createTestProps({
        interceptStatus: "Interception Success!"
      });
      wrapper = shallow(<Popup {...localProps} />);
      expect(wrapper.find("#success-msg").text()).toEqual("Interception Success!");
    });

    test("Should not display Success message on unsucesfull intercept", () => {
      let localProps = createTestProps({
        tabRecord: {
          interceptStatus: ""
        }
      });
      wrapper = shallow(<Popup {...localProps} />);
      expect(wrapper.find("#success-msg").exists()).toBeFalsy();
    });

    test("on clear button click, should trigger props.clearFields", () => {
      let localProps = createTestProps();
      wrapper = mount(<Popup {...localProps} />);
      wrapper.find(".btn-clear").simulate("click");
      expect(localProps.clearFields).toBeCalledWith(1);
    });
  });
});
