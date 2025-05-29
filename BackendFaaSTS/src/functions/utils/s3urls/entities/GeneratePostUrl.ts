export interface GenerateUrlRequest {
  resourceId: string
  resourceType: string
}

/**
 * @interface PostURLRequest
 *
 *
 * @description Interface for the request of the GeneratePostUrl
 * resourceType: string - The type of the resource that will be uploaded (e.g. 'reports')
 * resourceId: string - The id of the resource that will be uploaded (e.g. '123')
 * quantity: number - The quantity of URLs that will be generated
*/

export interface PostURLRequest extends GenerateUrlRequest {
  files: Array<{
    type: string
    name: string
  }>
}

/**
 * @interface GeneratePostUrlResponse
 * @description Interface for the response of the GeneratePostUrl
 * url: string - The URL that will be generated for the POST and GET requests
*/
export interface GenerateUrlInterface {
  url: string
}
