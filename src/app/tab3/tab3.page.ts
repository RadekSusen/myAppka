import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Needed for navigation
import { IonRouterOutlet } from '@ionic/angular'; // Detects when tab is active


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  favorites: any[] = [];
  breweryDetails: any = null; // Store selected brewery details
  view: 'favorites' | 'breweryDetails' = 'favorites'; // Tracks view state

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
  removeFavorite(brewery: any, event: Event) {
    event.stopPropagation();
    this.favorites = this.favorites.filter((fav) => fav.id !== brewery.id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  // Navigate to brewery details
  viewBreweryDetails(brewery: any) {
    this.breweryDetails = brewery;
    this.view = 'breweryDetails'; // Navigate to tab1 where details are displayed
  }

  // Show brewery on the map (navigate to Tab 2)
  showOnMap(brewery: any) {
    localStorage.setItem('selectedBrewery', JSON.stringify(brewery)); // Store brewery for Tab 2
    this.router.navigate(['/tabs/tab2']); // Navigate to Tab 2
  }

  // Back to the favorites list
  backToFavorites() {
    this.view = 'favorites';
    this.breweryDetails = null;
  }
}
