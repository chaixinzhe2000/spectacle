export default interface IServiceResponse<T> {
  success: boolean
  message: string
  payload: T
}

/**
 * Returns a new service response, appending an error message if the input sr failed.
 * 
 * @param sr - existing service response
 * @param message - additional message to append if sr wasn't successful
 */
export function getServiceResponse<T>(sr: IServiceResponse<T>, message?: string): IServiceResponse<T>{
  if (sr.success) {
    return successfulServiceResponse(sr.payload)
  } else {
    return failureServiceResponse(message + sr.message)
  }
}

/**
 * Returns a successful IServiceResponse with the given payload.
 * 
 * @param payload - payload to return
 */
export function successfulServiceResponse<T>(payload: T): IServiceResponse<T> {
  return {
    success: true,
    message: '',
    payload: payload
  }
}

/**
 * Returns a failure service response with the given error message.
 * 
 * @param message - error message
 */
export function failureServiceResponse<T>(message: string): IServiceResponse<T> {
  return {
    success: false,
    message: message,
    payload: null
  }
}

export function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
  return sr.success !== undefined && typeof sr.success === 'boolean'
  && sr.message !== undefined && typeof sr.message === 'string'
  && sr.payload !== undefined
}
