/**
 * Show object
 */
class Show {
  constructor( title,
    year,
    originalTitle, 
    urlBase,    // URL where crawl the info e.g: http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
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
    this.error = error | 'none';
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = Show;