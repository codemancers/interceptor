export function startListening = (inComingRequest:object)  => {
    type: 'START_LISTENING',
    requests : requests.concat(inComingRequest)
}

export function stopListening = (inComingRequest:object)  => {
  type: 'START_LISTENING',
  requests 
}
export function handleError = (errorMessage:string) => {
  type : 'ERROR',
  errorMessage
}