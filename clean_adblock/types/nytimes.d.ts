/**
 * @typedef {Object} NYTWindowPreloadedData
 * @property {Object} [initialData]
 * @property {Object} [initialData.data]
 * @property {Object} [initialData.data.article]
 * @property {Object} [initialData.data.article.sprinkledBody]
 * @property {Array<Object>} [initialData.data.article.sprinkledBody.content]
 */

/**
 * @typedef {Window & { __preloadedData?: NYTWindowPreloadedData }} NYTWindow
 */
