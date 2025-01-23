import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  searchQuery: string = ''; // The input from the search bar
  breweries: any[] = []; // Array to hold the search results

  countries: string[] = []; // List of countries
  states: string[] = []; // List of states/provinces for the selected country
  cities: string[] = []; // List of cities
  view: 'countries' | 'states' = 'countries'; // Tracks current view (countries or states)
  viewcity: string = 'states'; // Current view ('states' or 'cities')

  constructor(private http: HttpClient) {
    this.fetchAllCountries(); // Load countries on component initialization
  }

  searchBreweries() {
    if (this.searchQuery.trim() === '') {
      this.breweries = []; // Clear results if the search query is empty
      return;
    }

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
  }

  // fetch all cities in a state
  fetchCities(state: string) {
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_state=${encodeURIComponent(state)}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        // Extract unique cities from the response
        this.cities = [...new Set(response.map(brewery => brewery.city).filter(Boolean))].sort();
        this.viewcity = 'cities'; // Switch to cities view
      },
      (error) => {
        console.error(`Error fetching cities for ${state}:`, error);
      }
    );
  }

  // Go back to the country list view
  backToCountries() {
    this.view = 'countries';
  }
  backToStates() {
    this.view = 'states';
  }

  californiaCities: string[] = []; // Array to hold the list of California cities

  fetchCaliforniaCities() {
    const baseUrl = `https://api.openbrewerydb.org/v1/breweries`;
    let page = 1; // Start with the first page
    const perPage = 50; // Fetch up to 50 results per page
    const allCities = new Set<string>(); // Use a Set to store unique cities

    const fetchPage = () => {
      const apiUrl = `${baseUrl}?by_state=California&per_page=${perPage}&page=${page}`;
      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          if (response.length === 0) {
            // No more results, stop pagination
            this.californiaCities = Array.from(allCities).sort(); // Convert Set to sorted array
            return;
          }

          // Add cities from the current page
          response.forEach(brewery => {
            if (brewery.city) {
              allCities.add(brewery.city);
            }
          });

          // Fetch the next page
          page++;
          fetchPage();
        },
        (error) => {
          console.error(`Error fetching page ${page}:`, error);
        }
      );
    };

    // Start fetching the first page
    fetchPage();
  }

  allCountries: string[] = []; // Array to store all unique countries

  fetchAllCountries() {
    const baseUrl = `https://api.openbrewerydb.org/v1/breweries`;
    let page = 1; // Start with the first page
    const perPage = 50; // Number of results per page
    const countriesSet = new Set<string>(); // Use a Set to ensure unique countries

    const fetchPage = () => {
      const apiUrl = `${baseUrl}?per_page=${perPage}&page=${page}`;
      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          if (response.length === 0) {
            // No more results, finalize the list
            this.allCountries = Array.from(countriesSet).sort(); // Convert Set to sorted array
            return;
          }

          // Add countries from the current page
          response.forEach(brewery => {
            if (brewery.country) {
              countriesSet.add(brewery.country);
            }
          });

          // Fetch the next page
          page++;
          fetchPage();
        },
        (error) => {
          console.error(`Error fetching page ${page}:`, error);
        }
      );
    };

    // Start fetching from the first page
    fetchPage();
  }


}
