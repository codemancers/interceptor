export const aliases = {
  'START_LISTENING': (enabledStatus:boolean) => {
    console.log(enabledStatus)
    return {type : "START_LISTENING", payload : enabledStatus}
  },
  'STOP_LISTENING': (enabledStatus:boolean) => {
    console.log(enabledStatus)
    return {type : "START_LISTENING", payload : enabledStatus}
  }
}