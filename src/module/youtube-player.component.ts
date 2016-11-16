import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'youtube-player',
  template: `
      <iframe [id]="playerId"
         [width]="width"
         [height]="height"
         [src]="src"
         frameborder="0"
         allowfullscreen
         >
      </iframe>
      `
})
export class YoutubePlayerComponent implements OnInit {

  public player: any;
  public src: SafeResourceUrl;
  //private styleSafe: SafeUrl;

  @Input() width: number = 640;
  @Input() height: number = 390;
  @Input() videoId: string;
  @Input() playerId: string = "player";
  @Input() playlistId: string = '';
  //@Input() style: string;


  constructor(private sanitizer: DomSanitizer) {
    // this.width = 640;
    // this.height = 390;
    // this.videoId = "vntAEVjPBzQ"; //Ghostbusters :)
    // this.playerId = "player";
    //this.style = ""

  }

  ngOnInit() {

    //Extract videoId if it is an HTTP address and return Id
    if (this.videoId) {
      this.videoId = this.getIdFromURL(this.videoId)
    } else if (this.playlistId !== '') {
      this.videoId = ""
    } else {
      this.videoId = "vntAEVjPBzQ"; //Ghostbusters :)
    }

    if (this.playlistId !== ''){
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+ this.videoId + "?listType=playlist&list=" + this.playlistId)
    } else {
      //"https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1"
      //Sanitize the entry
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.videoId + "?enablejsapi=1")
    }
        //this.styleSafe = this.sanitizer.bypassSecurityTrustStyle(this.style)
  }

  private getIdFromURL(url: string) {
    // adapted from http://brandly.github.io/angular-youtube-embed/ and http://stackoverflow.com/a/5831191/1614967  
    var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    // /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig
    function contains(str: string, substr: string) {
      return (str.indexOf(substr) > -1);
    }
    var id = url.replace(youtubeRegexp, '$1');

    if (contains(id, ';')) {
      var pieces = id.split(';');

      if (contains(pieces[1], '%')) {
        // links like this:
        // "http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare"
        // have the real query string URI encoded behind a ';'.
        // at this point, `id is 'pxa6goHqzaA;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
        var uriComponent = decodeURIComponent(id.split(';')[1]);
        id = ('http://youtube.com' + uriComponent)
          .replace(youtubeRegexp, '$1');
      } else {
        // https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be
        // `id` looks like 'VbNF9X1waSc;feature=youtu.be' currently.
        // strip the ';feature=youtu.be'
        id = pieces[0];
      }
    } else if (contains(id, '#')) {
      // id might look like '93LvTKF_jW0#t=1'
      // and we want '93LvTKF_jW0'
      id = id.split('#')[0];
    }

    return id;
  };
}