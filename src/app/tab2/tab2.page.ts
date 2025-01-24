import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Import Leaflet

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  map: any; // Map instance

  constructor() { }

  ngOnInit() {
    this.loadMap(); // Load map when page is initialized
  }

  loadMap() {
    if (this.map) {
      this.map.remove(); // Remove previous map instance to prevent duplication
    }

    // Initialize Leaflet map
    this.map = L.map('map').setView([50.0755, 14.4378], 6); // Default: Prague, Czech Republic

    // Load OpenStreetMap tiles (Free alternative to Google Maps)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.addSelectedBreweryMarker();
  }

  // ✅ Add a marker if a brewery was sent from Tab 1
  addSelectedBreweryMarker() {
    const storedBrewery = localStorage.getItem('selectedBrewery');
    if (storedBrewery) {
      const brewery = JSON.parse(storedBrewery);
      if (brewery.latitude && brewery.longitude) {
        L.marker([brewery.latitude, brewery.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${brewery.name}</b><br>${brewery.city}, ${brewery.country}`)
          .openPopup();
      }
    }
  }
}