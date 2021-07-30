/**
 * Collection of shows. e.g. TVshow session
 */
class ShowCollection {
  constructor() {
    this.name = null // e.g: 'erase-una-vez/1490'
    this.url = null // url to page with list of links to other tvshows
    this.domain = null // Domain with shows (e.g. dontorren.org)
    this.shows = [] // Array with collection shows
    this.error = 0
  }

  toStringSimple() {
    let str = `ShowCollection: '${this.name}'\n`
    this.shows.forEach((show) => {
      str += `   Show -> Name:'${show.title}',
                 Session:'${show.currentSession}', 
                 Episode:'${show.currentEpisode}', 
                 Downloaded?:'${show.allreadyDownloaded}',
                 Release date:'${show.releaseDate}', 
                 urltodownload:'${show.urltodownload}'\n`
    })
    return str
  }

  push(show) {
    this.shows.push(show)
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = ShowCollection
