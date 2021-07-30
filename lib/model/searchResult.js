/**
 * Search result
 */
class SearchResult {
  constructor() {
    this.urlWithShow = null
    this.type = null
    this.show = null
  }

  toStringSimple() {
    return `SearchResult -> urlWithShow:'${this.urlWithShow}', 
            type:'${this.type}'`
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = SearchResult
