import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Import Leaflet

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  map: any; // Map instance
  searchQuery: string = ''; // Store search input
  allBreweries: any[] = []; // Store all breweries
  filteredBreweries: any[] = []; // Store filtered results
  markers: L.Marker[] = []; // Store marker references for updating

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

  // Add a marker if a brewery was sent from Tab 1
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

  // Load breweries from localStorage and API
  loadBreweries() {
    const storedBreweries = localStorage.getItem('breweries');
    if (storedBreweries) {
      this.allBreweries = JSON.parse(storedBreweries);
      this.filteredBreweries = [...this.allBreweries]; // Default to all breweries
      this.updateMapMarkers(); // Add markers when data is available
    }
  }

  // Search function that filters breweries based on the search query
  searchBreweries() {
    if (!this.searchQuery.trim()) {
      this.filteredBreweries = [...this.allBreweries]; // Reset if empty search
    } else {
      this.filteredBreweries = this.allBreweries.filter((brewery) =>
        brewery.city?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        brewery.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        brewery.state?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        brewery.country?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.updateMapMarkers(); // Update markers based on filtered results
  }

  // Update map markers based on filtered breweries
  updateMapMarkers() {
    this.markers.forEach(marker => this.map.removeLayer(marker)); // Remove old markers
    this.markers = []; // Clear stored markers

    this.filteredBreweries.forEach(brewery => {
      if (brewery.latitude && brewery.longitude) {
        const marker = L.marker([brewery.latitude, brewery.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${brewery.name}</b><br>${brewery.city}, ${brewery.country}`);
        this.markers.push(marker);
      }
    });
  }
}