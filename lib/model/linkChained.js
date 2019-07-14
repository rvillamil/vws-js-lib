/**
 * Wrapper por URLs. 
 * - this.current : The url
 * - this.from: The url from which this.current was called
 */
class LinkChained {

    constructor(current) {
        this.current = current
        this.from = null
    }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = LinkChained