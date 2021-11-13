/**
 * Collection of shows. e.g. TVshow session
 */
class ShowCollection {
  constructor() {
    this.location = null // e.g: 'erase-una-vez/1490'
    this.shows = [] // Array with collection shows
    this.urlwithCover = null
    this.error = 0
  }

  toStringSimple() {
    let str = `ShowCollection: '${this.location}'\n`
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
