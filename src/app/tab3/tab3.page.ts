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
  view: 'favorites' | 'breweryDetails' | 'addBrewery' = 'favorites'; // Tracks view state

  // Store new brewery details
  newBrewery = {
    name: '',
    brewery_type: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    website_url: ''
  };

  constructor(private router: Router, private outlet: IonRouterOutlet) { }

  // Refresh on opening tab3
  ionViewWillEnter() {
    this.loadFavorites();
  }

  // Loading favorite breweries from storage
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

  // Open the Add Brewery Form
  openAddBreweryForm() {
    this.view = 'addBrewery';
  }

  // Add the custom brewery to local storage
  addCustomBrewery() {
    if (!this.newBrewery.name || !this.newBrewery.brewery_type || !this.newBrewery.city || !this.newBrewery.state || !this.newBrewery.country) {
      alert("Please fill in all required fields.");
      return;
    }

    this.favorites.push({ ...this.newBrewery }); // Add new brewery to favorites
    localStorage.setItem('favorites', JSON.stringify(this.favorites));

    // Reset form
    this.newBrewery = { name: '', brewery_type: '', city: '', state: '', country: '', phone: '', website_url: '' };

    // Go back to favorites list
    this.view = 'favorites';
  }
}
