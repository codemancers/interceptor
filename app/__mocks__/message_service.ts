export const getRequests = jest.fn((tabId:number, callback) => {
  callback();
});

export const enableLogging = jest.fn();
export const clearData = jest.fn();
export const disableLogging = jest.fn();
export const getEnabledStatus = jest.fn((tabId:number, callback) => {
  callback()
});
