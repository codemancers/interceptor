import * as React from "react";
import { shallow } from "enzyme";
import { Popup } from "./../containers/Popup";

import * as MessageService from "../message_service";

jest.mock("../message_service");
const createTestProps = props => ({
  tabRecord: {
    PageDetails: [],
    checkedReqs: {},
    contentType: {},
    enabledStatus: false,
    errorMessage: "",
    interceptStatus: "",
    isInterceptorOn: true,
    requests: [],
    responseData: {},
    responseError: {},
    responseText: {},
    statusCodes: {}
  },
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

    test("Contains one button elements", () => {
      expect(wrapper.find("button")).toHaveLength(1);
    });

    test("should render RequestList component", () => {
      expect(wrapper.find("RequestList")).toHaveLength(1);
    });

    test("on start button click, should trigger enable message and updateField", () => {
      wrapper
        .find("button")
        .first()
        .simulate("click");
      expect(MessageService.enableLogging).toHaveBeenCalledWith(1);
    });
  });

  describe("on enabled", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("on stop button click, should trigger disable message and updateField", () => {
      let localProps = createTestProps({ tabRecord: { enabledStatus: true } });
      wrapper = shallow(<Popup {...localProps} />);
      wrapper
        .find("button")
        .first()
        .simulate("click");
      expect(MessageService.disableLogging).toHaveBeenCalledWith(1);
    });
  });

  describe("on error", () => {
    test("should render error message", () => {
      jest.clearAllMocks();
      let localProps = createTestProps({ tabRecord: { errorMessage: "Error" } });
      wrapper = shallow(<Popup {...localProps} />);
      expect(wrapper.find(".popup-error-message").text()).toEqual(expect.stringMatching("Error"));
    });
  });

  describe("on invalid url", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should call errorNotify and disable interception", () => {
      let localProps = createTestProps({
        currentUrl: "chrome://version"
      });
      wrapper = shallow(<Popup {...localProps} />);
      MessageService.getRequests.mockClear();
      wrapper
        .find("button")
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
  });
});
