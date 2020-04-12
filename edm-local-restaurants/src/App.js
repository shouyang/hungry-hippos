import React from 'react';
import { Button, Input } from 'semantic-ui-react'

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
    isFilterSet: false,
    locations : [],
    lat: 53.5461,
    lng: -113.4938,
    zoom: 13,
    filterRadius: 5
  }

  componentDidMount() {
    this.populateLocationsFromGoogleSheets();
  }

  render() {
    return (
      <div className="App"> 
        <PageHeader></PageHeader>


        <div className="map-container">
          <LocationsMap {...this.state} handleMarkerDragEnd={this.handleMarkerDragEnd.bind(this)}></LocationsMap>

          <hr />
          <div cnassNmae="map-buttons">
            <Button className="ui button" onClick={this.handleGetMyLocation.bind(this)} style={{backgroundColor:"limegreen", float: "left"}}>Get My Location</Button>
            <Input label={{ basic: true, content: `Up to ${this.state.filterRadius} Kilometres Away` }} labelPosition='right' min={1} max={10} step={0.1} value={this.state.filterRadius} onChange={this.handleFilterRadiusChanged.bind(this)} type='range' style={ {float: "left", backgroundColor:"limegreen"} }/>
            <Button className="ui button" onClick={this.handleFilterLocation.bind(this)} style={{backgroundColor:"limegreen", float: "left"}}>Filter For Locations Near Me</Button>
            <Button className="ui button" onClick={this.handleFilterReset.bind(this)} style={{backgroundColor:"limegreen", float: "right"}}>Reset Filter</Button>
          </div>
        </div>

        <LocationsTable locations={this.state.locations} ></LocationsTable>;
        {this.renderLocationsAsJSONArray()}
      </div> 
    ) 
  }

  renderLocationsAsJSONArray() {
    // Helper function to quickly display whats in locations.
    return <div>{ JSON.stringify(this.state.locations, null, "\t") }</div>;
  }

  async populateLocationsFromGoogleSheets() {
    let newState = { locations: await GoogleSheetsParser.getLocationsFromGoogleSheets() };
    this.setState(newState);
  }

  handleGetMyLocation() {
    console.log("handleGetMyLocation");
    const success = (pos) =>  {
      var crd = pos.coords;

      console.log(crd);
      this.setState({lat: crd.latitude, lng: crd.longitude})
      this.handleFilterLocation();
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  handleFilterRadiusChanged(event) {
    this.setState({filterRadius: event.target.value})
    this.handleFilterLocation();
  } 

  handleFilterLocation() {
    const updateLocations = (location) => {
      const distanceToMarker = location.distanceToLocationMeters(this.state.lat, this.state.lng);
      if (distanceToMarker <= this.state.filterRadius * 1000) {
        location.shouldBeShown = true;
      }
      else {
        location.shouldBeShown = false;
      }
      return location;
    }

    const newLocations = this.state.locations.map(updateLocations);
    this.setState( {locations: newLocations});
  }

  handleFilterReset() {
    const updateLocations = (location) => {
      location.shouldBeShown = true;
      return location;
    }

    const newLocations  = this.state.locations.map(updateLocations);
    this.setState( {locations: newLocations});
  }

  handleMarkerDragEnd(event) {
    const {lat, lng} = event.target._latlng;
    this.setState({lat, lng});
    this.handleFilterLocation();
  }

}

export default App;