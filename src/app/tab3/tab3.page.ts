import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  favorites: any[] = [];

  constructor() {
    this.loadFavorites();
  }

  loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  removeFavorite(brewery: any) {
    this.favorites = this.favorites.filter((fav) => fav.id !== brewery.id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}
