import React from "react";
import { Button, Input } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import PageHeader from "./components/PageHeader";
import Location from "./models/Location";
import LocationsMap from "./components/LocationsMap";
import LocationsTable from "./components/LocationsTable";

import { AppConfig } from "./config/AppConfig.js";

class GoogleSheetsParser {
  // Handler for requesting and parsing Google Sheets lists requests.
  static async getLocationsFromGoogleSheets() {
    const response = await fetch(AppConfig.urls.googleSheetsURL);
    const json = await response.json();

    const entriesJSON = json.feed.entry;

    return entriesJSON.map((entry) => {
      return new Location(entry);
    });
  }
}

class App extends React.Component {
  state = { ...AppConfig.defaultState };

  componentDidMount() {
    this.populateLocationsFromGoogleSheets();
  }

  async populateLocationsFromGoogleSheets() {
    let newState = {
      locations: await GoogleSheetsParser.getLocationsFromGoogleSheets(),
    };
    this.setState(newState);
  }

  render() {
    const { mapSection: mapConfig } = AppConfig;

    return (
      <div className="App">
        <PageHeader></PageHeader>
        <div className={mapConfig.css.mapContainer}>
          <LocationsMap
            {...this.state}
            handleMarkerDragEnd={this.handleMarkerDragEnd.bind(this)}
          ></LocationsMap>

          <hr />
          <div className={mapConfig.css.mapControls}>
            <Button
              className={mapConfig.css.mapButtons}
              style={mapConfig.style.greenFloatLeft}
              onClick={this.handleGetMyLocation.bind(this)}
            >
              Get My Location
            </Button>
            <Input
              {...mapConfig.inputAttributes.inputLocationRange}
              label={{
                basic: true,
                content: `Up to ${this.state.filterRadius} Kilometres Away`,
              }}
              value={this.state.filterRadius}
              onChange={this.handleFilterRadiusChanged.bind(this)}
              style={mapConfig.style.greenFloatLeft}
            />
            <Button
              className={mapConfig.css.mapButtons}
              onClick={this.handleFilterLocation.bind(this)}
              style={mapConfig.style.greenFloatLeft}
            >
              Filter For Locations Near Me
            </Button>
            <Button
              className={mapConfig.css.mapButtons}
              onClick={this.handleFilterReset.bind(this)}
              style={mapConfig.style.greenFloatRight}
            >
              Reset Filter
            </Button>
          </div>
        </div>
        <LocationsTable locations={this.state.locations}></LocationsTable>;
        {this.renderLocationsAsJSONArray()}
      </div>
    );
  }

  renderLocationsAsJSONArray() {
    // Helper function to quickly display whats in locations.
    return <div>{JSON.stringify(this.state.locations, null, "\t")}</div>;
  }

  handleGetMyLocation() {
    console.log("handleGetMyLocation");
    const success = (pos) => {
      var crd = pos.coords;

      console.log(crd);
      this.setState({ lat: crd.latitude, lng: crd.longitude });
      this.handleFilterLocation();
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  handleFilterRadiusChanged(event) {
    this.setState({ filterRadius: event.target.value });
    this.handleFilterLocation();
  }

  handleFilterLocation() {
    const updateLocations = (location) => {
      const distanceToMarker = location.distanceToLocationMeters(
        this.state.lat,
        this.state.lng
      );
      if (distanceToMarker <= this.state.filterRadius * 1000) {
        location.shouldBeShown = true;
      } else {
        location.shouldBeShown = false;
      }
      return location;
    };

    const newLocations = this.state.locations.map(updateLocations);
    this.setState({ locations: newLocations });
  }

  handleFilterReset() {
    const updateLocations = (location) => {
      location.shouldBeShown = true;
      return location;
    };

    const newLocations = this.state.locations.map(updateLocations);
    this.setState({ locations: newLocations });
  }

  handleMarkerDragEnd(event) {
    const { lat, lng } = event.target._latlng;
    this.setState({ lat, lng });
    this.handleFilterLocation();
  }
}

export default App;
