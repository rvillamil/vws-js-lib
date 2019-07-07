/**
 * Film, video or tvshow
 */
class Show {

    constructor() {

        this.title = null
        this.year = null
        this.originalTitle = null
        this.urlBase = null
        this.description = null
        this.sinopsis = null
        this.quality = null
        this.urlwithCover = null
        this.fileSize = null
        this.releaseDate = null
        this.urltodownload = null

        this.imdbRating = null
        this.imdbID = null
        this.rottenTomatoes = null
        this.tmdbRating = null
        this.error = 0

        // TVShows
        this.currentSession = null
        this.currentEpisode = null
        this.collectionName = null

        // More
        this.allreadyDownloaded = false
    }

    toStringSimple() {
        return `Show -> Title:'${this.title}', 
            Session:'${this.currentSession}', 
            Episode:'${this.currentEpisode}', 
            Downloaded?:'${this.allreadyDownloaded}', 
            urltodownload:'${this.urltodownload}'`
    }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = Show