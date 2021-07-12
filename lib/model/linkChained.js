/**
 * Wrapper por URLs. 
 * - this.domain : The domain
 * - this.from: The url
 */
class LinkChained {

  constructor(domain) {
    this.domain = domain
    this.from = null
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = LinkChained