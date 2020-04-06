import React from 'react';

import { Table } from 'semantic-ui-react'

class LocationsTable extends React.Component {
  // Renders a table from an array of locations.

  // Table to display list of locations
  static keysToInclude     = ["name", "cusine", "area", "hours", "delivery", "pickup", "giftcards", "dietaryNeeds", "address", "comments"]
  static keysToColumnNames = {
    "name" : "Business Name",
    "cusine" : "Cusine",
    "area": "Area",
    "hours": "Hours",
    "delivery": "Delivery",
    "pickup": "Pickup",
    "giftcards": "Gift Cards",
    "dietaryNeeds": "Diet Needs",
    "address": "Address",
    "comments": "Notes"
  }
 
 
  render() {
    const locationsTodisplay = this.props.locations.filter( (location) => location.shouldBeShown)

    return (
      <Table>
        {this.renderTableHeader(this.props.locations)}
        {this.renderTableBody(locationsTodisplay)}
      </Table>)
  }

  renderTableHeader() {
    return (
      <Table.Header>
        {LocationsTable.keysToInclude.map( (key) => (<Table.HeaderCell>{LocationsTable.keysToColumnNames[key]}</Table.HeaderCell>))}
      </Table.Header>
    )
  }

  renderTableBody(locations) {
    return <Table.Body>{locations.map(this.renderTableRow)}</Table.Body>;
  }

  renderTableRow(location) {
    return <Table.Row>{LocationsTable.keysToInclude.map( (key) => <Table.Cell>{location[key]}</Table.Cell>)}</Table.Row>
  }
}

export default LocationsTable;