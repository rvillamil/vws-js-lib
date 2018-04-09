// NPM modules
const TVShowLink = require('./tvshowlink');

/**
 * Show object
 */
class Show {

  constructor(title,
    year,
    originalTitle,
    urlBase, // URL where crawl the info e.g: http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
    description,
    sinopsis,
    quality,
    urlwithCover,
    fileSize,
    releaseDate,
    urltodownload,
    imdbRating,
    imdbID,
    rottenTomatoes,
    tmdbRating,
    error) {

    this.title = title;
    this.year = year;
    this.originalTitle = originalTitle;
    this.urlBase = urlBase;
    this.description = description;
    this.sinopsis = sinopsis;
    this.quality = quality;
    this.urlwithCover = urlwithCover;
    this.fileSize = fileSize;
    this.releaseDate = releaseDate;
    this.urltodownload = urltodownload;

    this.imdbRating = imdbRating;
    this.imdbID = imdbID;
    this.rottenTomatoes = rottenTomatoes;
    this.tmdbRating = tmdbRating;
    this.error = error;
    // TVShows
    this.currentSession = null;
    this.currentEpisode = null;
    this.previousTVShowLinks = []; // Array with previous episodes and links to downlas
  }

  /**
   * Add in previousTVShowLinks array, TVShowLink objects with the session, episode and urltodownload, on every show in 'fromShows' list 
   * 
   * @param {*} fromShows Show array
   */
  addPreviousTVShowLinks(fromShows) {
    var i;
    for (i = 0; i < fromShows.length; i++) {
      var tvShowLink = new TVShowLink(
        fromShows[i].currentSession,
        fromShows[i].currentEpisode,
        fromShows[i].urltodownload)

      this.tvShowLinks.push(tvShowLink)
    }
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = Show;