import React from 'react';
import L from 'leaflet'

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Table, Header, Button, Form} from 'semantic-ui-react'

var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

class Location {
  // Data class representing one row from the Google Sheets Document.
  constructor(entry) {
    // Unpacks interesting entries from the Google Sheets JSON API into a simpler object.
    this.id = entry.id.$t;

    this.name                = entry["gsx$name"].$t;
    this.status              = entry["gsx$status"].$t;
    this.cusine              = entry["gsx$cusine"].$t;
    this.area                = entry["gsx$area"].$t;
    this.hours               = entry["gsx$hours-unsureofcovid-19hours"].$t;
    this.delivery            = entry["gsx$delivery"].$t;
    this.pickup              = entry["gsx$pickup"].$t;
    this.giftcards           = entry["gsx$giftcards"].$t;
    this.dietaryNeeds        = entry["gsx$dietaryneedsserved"].$t;
    this.address             = entry["gsx$address"].$t;
    this.comments            = entry["gsx$comments"].$t;

    this.lat                 = entry["gsx$lat"].$t;
    this.long                = entry["gsx$long"].$t;
  }

  // TODO: Probably add some functionality to unpack attributes (addresses, hours, cusine types etc...)
  // TODO: Maybe add resolvers to Google Maps, Food Delivery etc...
}

class LocationsMap extends React.Component {

  renderLocationMarker(location) {
    return (
      <Marker position={ [location.lat, location.long]} icon={greenIcon}>
        <Popup>{location.name}</Popup>
      </Marker>
    )
  }

  render() {
    const position = [this.props.lat, this.props.lng];
  
    const locationsWithLongLat = this.props.locations.filter( (location) => {return !!(!!location.lat && !!location.long)})
    console.log(locationsWithLongLat);

    return (
      <Map center={position} zoom={this.props.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br/> Easily customizable.
          </Popup>
        </Marker>

        {locationsWithLongLat.map(this.renderLocationMarker)}
      </Map>
    );
  }
}

class LocationsTable extends React.Component {
  // Table to display list of locations
  static keysToInclude = ["name", "cusine", "area", "hours", "delivery", "pickup", "giftcards", "dietaryNeeds", "address", "comments"]

  renderHeader() {
    return (
      <Table.Header>
        {LocationsTable.keysToInclude.map( (key) => (<Table.HeaderCell>{key}</Table.HeaderCell>))}
      </Table.Header>
    )
  }

  renderBody(locations) {
    return (
      <Table.Body>
        {locations.map(this.renderLocationRow) }
      </Table.Body>
    )
  }

  renderLocationRow(location) {
    return (
      <Table.Row>
        {
          LocationsTable.keysToInclude.map(
          (key) => <Table.Cell>{location[key]}</Table.Cell>
          )
        }
      </Table.Row>
    )
  }

  render() {
    return (
      <Table celled>
        {this.renderHeader(this.props.locations)}
        {this.renderBody(this.props.locations)}
      </Table>
    )
  }
}


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
        <Header>Edmonton-Local</Header>
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