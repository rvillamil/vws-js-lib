/**
 * TVShowLink
 */
class TVShowLink {

  constructor(session, episode, urltodownload) {
    // TVShows
    this.session = session;
    this.episode = episode;
    this.urltodownload = urltodownload
  }
}

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
    this.tvShowLinks = []; // Array with previous episodes and links to downlas
  }

  mergeTVShowLinks(fromShows) {
    var i;
    for (i = 1; i < fromShows.length; i++) {
      tvShowLink = new TVShowLink(
        fromShows[i].sesion,
        fromShows[i].episode,
        fromShows[i].urltodownload)

      this.tvShowLinks.push(tvShowLink)
    }
  }

}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = Show;
module.exports = TVShowLink;