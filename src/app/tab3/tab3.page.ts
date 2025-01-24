import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Needed for navigation
import { IonRouterOutlet } from '@ionic/angular'; // ✅ Detects when tab is active


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  favorites: any[] = [];

  constructor(private router: Router, private outlet: IonRouterOutlet) { }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  // Remove brewery from favorites and update localStorage
  removeFavorite(brewery: any) {
    this.favorites = this.favorites.filter((fav) => fav.id !== brewery.id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  // Navigate to brewery details
  viewBreweryDetails(brewery: any) {
    localStorage.setItem('selectedBrewery', JSON.stringify(brewery)); // Store selected brewery
    this.router.navigate(['/tabs/tab1']); // Navigate to tab1 where details are displayed
  }
}
