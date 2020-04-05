import React from 'react';
import { Button, Form } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import PageHeader from "./components/PageHeader";
import Location from "./models/Location";
import LocationsMap from "./components/LocationsMap";
import LocationsTable from "./components/LocationsTable";

class GoogleSheetsParser {
  // Handler for requesting and parsing Google Sheets lists requests.
  
  static getUrl() {
    // Configuration for the Google Sheets Lists API
    const spreadsheetID  = "1YvbMUEEGha3hEQ6CDd0K1C4WVkAMmszbBRuRQ-ndxKU";
    const worksheetID     = "oc6o2es";

    const URL_TEMPLATE = `https://spreadsheets.google.com/feeds/list/${spreadsheetID}/${worksheetID}/public/values?alt=json`
    return URL_TEMPLATE; 
  }

  static async getLocationsFromGoogleSheets() {
    // Returns a promise of an array of Location objects representing the rows in the Google Sheets.
    try {
      const url      = GoogleSheetsParser.getUrl();
      const response = await fetch(url);
      const json     = await response.json();
  
      const  entriesJSON  = json.feed.entry; 
      return entriesJSON.map(this.parseJSONEntriesToLocations);
    } 
    catch (error) {
      console.log(error)
      return null;
    }
  }

  static parseJSONEntriesToLocations(entry) {
    return new Location(entry);
  }
}

class App extends React.Component {
  state =  {
    locations : [],
    lat: 53.5461,
    lng: -113.4938,
    zoom: 13,
    value:5
  }

  componentDidMount() {
    this.populateLocationsFromGoogleSheets();
  }

  async populateLocationsFromGoogleSheets() {
    let newState = { locations: await GoogleSheetsParser.getLocationsFromGoogleSheets() };
    this.setState(newState);
  }

  handleGetMyLocation() {
    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 1000
    };
    
    const success = (pos) =>  {
      var crd = pos.coords;
      this.setState({lat: crd.latitude, lng: crd.longitude})
    }


    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    console.log(this);
    navigator.geolocation.getCurrentPosition(success, error, options);
  }


  render() {
    const settings = {
      start: 2,
      min: 0,
      max: 10,
      step: 1,
      onChange: {}
    };
  
    return (
      <div className="App"> 
        <PageHeader></PageHeader>
        <LocationsMap {...this.state} ></LocationsMap>
        <Button className="ui button" onClick={this.handleGetMyLocation.bind(this)} style={{backgroundColor:"limegreen"}}>Get My Location</Button>
        <Form.Input
            action="Test"
            label={`Test`}
            min={1}
            max={100}
            name='Test'
            onChange={() => {}}
            step={100}
            type='range'
            value={5}
          />
        <LocationsTable locations={this.state.locations} ></LocationsTable>;
        {this.renderLocationsAsJSONArray()}
      </div> 
    ) 
  }

  renderLocationsAsJSONArray() {
    // Helper function to quickly display whats in locations.
    return <div>{ JSON.stringify(this.state.locations, null, "\t") }</div>;
  }
}
export default App;