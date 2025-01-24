import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { state } from '@angular/animations';

import { Router } from '@angular/router'; // Needed for navigation

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  searchQuery: string = ''; // The input from the search bar
  breweries: any[] = []; // Array to hold the search results
  allBreweries: any[] = []; // Stores all brewery data

  countries: string[] = []; // List of countries
  states: string[] = []; // List of states/provinces for the selected country
  cities: string[] = []; // List of cities
  view: 'countries' | 'states' | 'cities' | 'breweries' | 'breweryDetails' = 'countries'; // Tracks current view (countries or states)
  //viewcity: string = 'states'; // Current view ('states' or 'cities')
  favorites: any[] = []; // Store favorite breweries

  constructor(private http: HttpClient, private router: Router) {
    this.loadFavorites();
    this.fetchBreweries(); // Load countries on component initialization
  }
  isLoading = true; // Declare a loading state

  normalizeCountry(country: string): string {
    return country ? country.trim().toLowerCase().replace('the ', '') : '';
  }

  // Fetch all breweries to extract countries and states
  fetchBreweries() {
    this.isLoading = true; // Declare a loading state

    const cachedData = localStorage.getItem('breweries');
    if (cachedData) {
      this.allBreweries = JSON.parse(cachedData);
      this.extractCountriesAndStates();
      this.isLoading = false;
      return;
    }

    const normalizeCountry = (country: string) => {
      if (!country) return '';
      return country.trim().toLowerCase().replace('the ', ''); // Normalize
    };

    const apiUrl = 'https://api.openbrewerydb.org/v1/breweries';
    let currentPage = 1;
    const breweriesPerPage = 100;
    let isFetching = true;
    this.allBreweries = [];
    this.countries = [];
    const countriesSet = new Set<string>(); // Track unique countries

    const fetchPage = (page: number) => {
      if (!isFetching) return; // Stop if no more data

      this.http.get<any[]>(`${apiUrl}?page=${page}&per_page=${breweriesPerPage}`).subscribe(
        (response) => {
          if (response.length === 0) {
            isFetching = false;
            localStorage.setItem('breweries', JSON.stringify(this.allBreweries)); // Cache data
            this.extractCountriesAndStates();
            return;
          }

          // Append breweries
          this.allBreweries = [...this.allBreweries, ...response];

          // Extract unique countries dynamically
          response.forEach((brewery) => {
            if (brewery.country) {
              countriesSet.add(normalizeCountry(brewery.country));
            }
          });

          // Update UI progressively
          this.countries = Array.from(countriesSet).sort();

          // Fetch next page
          fetchPage(page + 1);
        },
        (error) => {
          console.error(`Error fetching breweries on page ${page}:`, error);
          this.isLoading = false; // Hide loading on error
        }
      );
    };

    fetchPage(currentPage);
  }


  extractCountriesAndStates() {
    this.countries = [
      ...new Set(this.allBreweries.map((brewery) => brewery.country).filter(Boolean))
    ].sort();
  }

  searchBreweries() {
    if (this.searchQuery.trim() === '') {
      this.breweries = []; // Clear results if the search query is empty
      return;
    }

    // Search across all breweries, not just the filtered ones
    this.breweries = this.allBreweries.filter((brewery) =>
      brewery.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      brewery.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      brewery.state.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      brewery.country.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.view = 'breweries'; // Ensure the results are displayed

    /*
        const apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${this.searchQuery}&per_page=10`;
    
        this.http.get<any[]>(apiUrl).subscribe(
          (response) => {
            this.breweries = response; // Update breweries array with API response
          },
          (error) => {
            console.error('Error fetching data:', error);
            this.breweries = []; // Clear results in case of an error
          }
        );
    */
  }


  // Fetch a unique list of countries from the API
  fetchCountries() {
    const apiUrl = 'https://api.openbrewerydb.org/v1/breweries';
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.countries = [...new Set(response.map(brewery => brewery.country).filter(Boolean))].sort();
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }


  // Fetch a unique list of states/provinces for the selected country
  /*
  fetchStates(country: string) {
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_country=${encodeURIComponent(country)}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.states = [...new Set(response.map(brewery => brewery.state).filter(Boolean))].sort();
        this.view = 'states'; // Switch to state view
      },
      (error) => {
        console.error(`Error fetching states for ${country}:`, error);
      }
    );
  }*/
  fetchStates(country: string) {
    this.states = [
      ...new Set(
        this.allBreweries
          .filter((brewery) => brewery.country === country)
          .map((brewery) => brewery.state)
          .filter(Boolean)
      )
    ].sort();
    this.view = 'states'; // Switch to state view
  }

  // fetch all cities in a state
  fetchCities(state: string) {
    this.cities = [
      ...new Set(
        this.allBreweries
          .filter((brewery) => brewery.state === state)
          .map((brewery) => brewery.city)
          .filter(Boolean)
      )
    ].sort();
    this.view = 'cities'; // Switch to city view
  }

  fetchBreweriesInCity(city: string) {
    this.breweries = this.allBreweries
      .filter((brewery) => brewery.city === city)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.view = 'breweries';
  }

  // Store selected brewery details
  breweryDetails: any = null;

  viewBreweryDetails(brewery: any) {
    this.breweryDetails = brewery;
    this.view = 'breweryDetails';
  }

  backToBreweries() {
    this.breweryDetails = null;
    this.view = 'breweries';
  }


  // Go back to the country list view
  backToCountries() {
    this.view = 'countries';
  }
  backToStates() {
    this.view = 'states';
  }
  backToCities() {
    this.view = 'cities';
  }

  // Add or remove a brewery from favorites
  toggleFavorite(brewery: any) {
    const index = this.favorites.findIndex((fav) => fav.id === brewery.id);
    if (index === -1) {
      this.favorites.push(brewery);
    } else {
      this.favorites.splice(index, 1);
    }
    this.saveFavorites(); // Save changes to storage
  }

  // Check if a brewery is in favorites
  isFavorite(brewery: any): boolean {
    return this.favorites.some((fav) => fav.id === brewery.id);
  }

  // Save favorites to localStorage
  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  // Load favorites from localStorage
  loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  // Send the brewery's location to Tab 2 and open the map
  showOnMap(brewery: any) {
    localStorage.setItem('selectedBrewery', JSON.stringify(brewery));
    this.router.navigate(['/tabs/tab2']); // Navigate to Tab 2
  }
}
