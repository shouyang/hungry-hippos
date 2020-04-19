import React from "react";
import { Button, Input } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import PageHeader from "./components/PageHeader";
import Location from "./models/Location";
import LocationsMap from "./components/LocationsMap";
import LocationsTable from "./components/LocationsTable";

import {
  urls,
  simpleStyles,
  cssClasses,
  defaultStates,
  defaultProps,
} from "./config/AppConfig.js";

class GoogleSheetsParser {
  // Handler for requesting and parsing Google Sheets lists requests.
  static async getLocationsFromGoogleSheets() {
    const response = await fetch(urls.googleSheetsURL);
    const json = await response.json();

    const entriesJSON = json.feed.entry;

    return entriesJSON.map((entry) => {
      return new Location(entry);
    });
  }
}

class App extends React.Component {
  state = { ...defaultStates.app };

  componentDidMount() {
    this.populateLocationsFromGoogleSheets();
  }

  async populateLocationsFromGoogleSheets() {
    this.setState({
      locations: await GoogleSheetsParser.getLocationsFromGoogleSheets(),
    });
  }

  render() {
    return (
      <div className="App">
        <PageHeader></PageHeader>
        <div className={cssClasses.mapContainer}>
          <LocationsMap
            {...this.state}
            handleMarkerDragEnd={this.handleMarkerDragEnd.bind(this)}
          ></LocationsMap>

          <hr />
          <div className={cssClasses.mapControls}>
            <Button
              className={cssClasses.mapButtons}
              style={simpleStyles.greenFloatLeft}
              onClick={this.handleGetMyLocation.bind(this)}
            >
              Get My Location
            </Button>
            <Input
              {...defaultProps.locationSlider}
              label={{
                basic: true,
                content: `Up to ${this.state.filterRadius} Kilometres Away`,
              }}
              value={this.state.filterRadius}
              onChange={this.handleFilterRadiusChanged.bind(this)}
              style={simpleStyles.greenFloatLeft}
            />
            <Button
              className={cssClasses.mapButtons}
              onClick={this.handleFilterLocation.bind(this)}
              style={simpleStyles.greenFloatLeft}
            >
              Filter For Locations Near Me
            </Button>
            <Button
              className={cssClasses.mapButtons}
              onClick={this.handleFilterReset.bind(this)}
              style={simpleStyles.greenFloatRight}
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
