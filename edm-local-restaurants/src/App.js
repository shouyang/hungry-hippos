import React from "react";
import { Button, Input } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import PageHeader from "./components/PageHeader";
import Location from "./models/Location";
import LocationsMap from "./components/LocationsMap";
import LocationsTable from "./components/LocationsTable";

import { urls, simpleStyles, cssClasses, defaultStates, defaultProps, labels } from "./config/AppConfig.js";

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
  mapPopupRefs = new Map();

  setRef = (key, ref) => {
    this.mapPopupRefs.set(key, ref);
  };

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
            setRef={this.setRef}
          ></LocationsMap>

          <hr />
          <div className={cssClasses.mapControls}>
            <Button
              className={cssClasses.mapButtons}
              style={simpleStyles.greenFloatLeft}
              onClick={this.handleGetMyLocation.bind(this)}
            >
              {labels.getCurrentLocation}
            </Button>
            <Button
              className={cssClasses.mapButtons}
              onClick={this.filterByDistance.bind(this)}
              style={simpleStyles.greenFloatLeft}
            >
              Filter To Locations Near Me
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
              onClick={this.resetLocationFilter.bind(this)}
              style={simpleStyles.greenFloatRight}
            >
              Reset Filter
            </Button>
          </div>
        </div>
        <LocationsTable
          locations={this.state.locations}
          onRowClick={this.openMapPopupByName.bind(this)}
        ></LocationsTable>
        {this.renderLocationsAsJSONArray()}
      </div>
    );
  }

  renderLocationsAsJSONArray() {
    // Helper function to quickly display whats in locations.
    return <div>{JSON.stringify(this.state.locations, null, "\t")}</div>;
  }

  handleGetMyLocation() {
    const success = (pos) => {
      const crd = pos.coords;
      this.setState({ lat: crd.latitude, lng: crd.longitude });
      this.filterByDistance();
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }

  handleMarkerDragEnd(event) {
    const { lat, lng } = event.target._latlng;
    this.setState({ lat, lng });
    this.filterByDistance();
  }

  handleFilterRadiusChanged(event) {
    this.setState({ filterRadius: event.target.value });
    this.filterByDistance();
  }

  filterByDistance() {
    const updateLocations = (location) => {
      const distanceToMarker = location.distanceToLocationMeters(this.state.lat, this.state.lng);
      if (distanceToMarker <= this.state.filterRadius * 1000) {
        location.shouldBeShown = true;
      } else {
        location.shouldBeShown = false;
      }
      return location;
    };

    this.setState({ locations: this.state.locations.map(updateLocations) });
  }

  resetLocationFilter = () => {
    const updateLocations = (location) => {
      location.shouldBeShown = true;
      return location;
    };

    this.setState({ locations: this.state.locations.map(updateLocations) });
  };

  openMapPopupByName = (name) => {
    const popupRef = this.mapPopupRefs.get(name);
    if (popupRef && popupRef.leafletElement) {
      popupRef.leafletElement.openPopup();
    }
  };
}

export default App;
