/**
 * Show object
 */
class Show {
    constructor(urlBase,
                title,
                originalTitle,
                year,
                description,
                sinopsis,
                quality,
                urlwithCover,
                fileSize,
                releaseDate,
                urltodownload) {
      this.urlBase          = urlBase;
      this.title            = title;
      this.originalTitle    = originalTitle;
      this.year             = year;
      this.description      = description;      
      this.sinopsis         = sinopsis;
      this.quality          = quality;
      this.urlwithCover     = urlwithCover;
      this.fileSize         = fileSize;
      this.releaseDate      = releaseDate;      
      this.urltodownload    = urltodownload;      
      // TVShow: session 
      // TVShow: episode      
    }
  }

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = Show;