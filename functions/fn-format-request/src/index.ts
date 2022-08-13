function handler(
  event: AWSCloudFrontFunction.Event,
): AWSCloudFrontFunction.Request {
  const request = event.request

  if (request.method !== 'GET' && request.method !== 'OPTION') {
    return request
  }

  const uri = request.uri

  // Check if at root path
  if (uri === '/') {
    request.uri += 'index.html'

    // Check whether the URI ends with "/"
  } else if (uri.endsWith('/')) {
    request.uri = request.uri.slice(0, -1) + '.html'

    // Check whether the URI is missing a file extension
  } else if (!uri.includes('.')) {
    request.uri += '.html'
  }

  return request
}
