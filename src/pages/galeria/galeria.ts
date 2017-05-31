import { Api } from './../../providers/api';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PhotoLibrary, AlbumItem } from '@ionic-native/photo-library';

@Component({
  selector: 'page-galeria',
  templateUrl: 'galeria.html',
})
export class Galeria {
  photos = [];
  current_page = 0;
  per_page = 18;
  max_page = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,
    public photolibrary: PhotoLibrary, public alert: AlertController, public zone: NgZone) {
  }

  ionViewDidLoad() {
    this.photolibrary.requestAuthorization().then(() => {
      this.photolibrary.getLibrary().subscribe({
        next: library => {
          this.zone.run(() => {
            var array = [];
            library.forEach((libraryItem) => {
              console.log(libraryItem.fileName);
              array[this.photos.length] = libraryItem;
            });
            this.photos = array;
            this.max_page = this.photos.length / this.per_page;
          });
        },
        error: err => { },
        complete: () => { console.log("could not get photos"); }
      });
    })
      .catch(err => console.error("permissions weren't granted", err));
  }

  getPhotos() {
    return this.photos.slice(this.per_page * this.current_page, this.per_page * this.current_page + this.per_page);
  }

  refresh(refresher) {
    this.ionViewDidLoad();
    refresher.complete();
  }

}
