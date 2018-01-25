import TypeKeys from './type_keys'

export interface StartListeningAction {
  type: TypeKeys.START_LISTENING
};
export interface StopListeningAction {
  type: TypeKeys.STOP_LISTENING,
};
export interface ErrorAction {
  type: TypeKeys.ERROR
};
export interface OtherAction {
  type: TypeKeys.OTHER_ACTION;
}

export default type ActionTypes = | StartListeningAction | StopListeningAction | ErrorAction;