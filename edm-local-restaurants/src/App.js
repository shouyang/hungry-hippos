import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'


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
  }

  // TODO: Probably add some functionality to unpack attributes (addresses, hours, cusine types etc...)
  // TODO: Maybe add resolvers to Google Maps, Food Delivery etc...
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
    locations : []
  }

  componentDidMount() {
    this.populateLocationsFromGoogleSheets();
  }

  async populateLocationsFromGoogleSheets() {
    let newState = { locations: await GoogleSheetsParser.getLocationsFromGoogleSheets() };
    this.setState(newState);
  }

  render() {
    return (
      <div className="App"> 
        <LocationsTable locations={this.state.locations} ></LocationsTable>;
      </div> 
    ) 
  }

  renderLocationsAsJSONArray() {
    // Helper function to quickly display whats in locations.
    return <div>{ JSON.stringify(this.state.locations, null, "\t") }</div>;
  }
}
export default App;

