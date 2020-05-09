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
  mapContainerRef = React.createRef();

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
        <div ref={this.mapContainerRef} className={cssClasses.mapContainer}>
          <LocationsMap
            {...this.state}
            handleMarkerDragEnd={this.handleMarkerDragEnd.bind(this)}
            setRef={this.setRef}
          ></LocationsMap>
          <div className={cssClasses.mapControls}>
            <Button
              color="teal"
              size="small"
              className={cssClasses.mapButtons}
              style={simpleStyles.greenFloatLeft}
              onClick={this.handleGetMyLocation.bind(this)}
            >
              {labels.getCurrentLocation}
            </Button>
            <Input
              {...defaultProps.locationSlider}
              label={{
                basic: true,
                content: `Within ${this.state.filterRadius} Km`,
              }}
              value={this.state.filterRadius}
              onChange={this.handleFilterRadiusChanged.bind(this)}
              style={simpleStyles.greenFloatLeft}
              size="tiny"
              color="teal"
            />
            <Button
              color="teal"
              size="small"
              className={cssClasses.mapButtons}
              onClick={this.resetLocationFilter.bind(this)}
              style={simpleStyles.greenFloatRight}
            >
              Show All Locations
            </Button>
          </div>
        </div>
        <LocationsTable
          locations={this.state.locations}
          onRowClick={this.openMapPopupByName.bind(this)}
        ></LocationsTable>
      </div>
    );
  }
  handleGetMyLocation() {
    const success = (pos) => {
      const crd = pos.coords;
      this.setState({ lat: crd.latitude, lng: crd.longitude });
      this.filterByDistance();
    };

    const error = (err) => {
      alert("We couldn't seem to get your location. Did you enable some sort of privacy mode?");
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
    const updatedLocations = this.state.locations.map((location) => {
      const distanceToMarker = location.distanceToLocationMeters(this.state.lat, this.state.lng);
      location.shouldBeShown = distanceToMarker <= this.state.filterRadius * 1000 ? true : false;

      return location;
    });

    this.setState({ locations: updatedLocations });
  }

  resetLocationFilter = () => {
    const updatedLocations = this.state.locations.map((location) => {
      location.shouldBeShown = true;
      return location;
    });

    this.setState({ locations: updatedLocations });
  };

  openMapPopupByName = (name) => {
    const popupRef = this.mapPopupRefs.get(name);
    if (popupRef && popupRef.leafletElement) {
      popupRef.leafletElement.openPopup();
      this.mapContainerRef.current.scrollIntoView(false);
    }
  };
}

export default App;
