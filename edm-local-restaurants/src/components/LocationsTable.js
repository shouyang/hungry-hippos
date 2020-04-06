import React from 'react';

import { Table } from 'semantic-ui-react'

class LocationsTable extends React.Component {
  // Renders a table from an array of locations.

  // Table to display list of locations
  static keysToInclude = ["name", "cusine", "area", "hours", "delivery", "pickup", "giftcards", "dietaryNeeds", "address", "comments"]
  render() {
    const locationsTodisplay = this.props.locations.filter( (location) => location.shouldBeShown)

    return (<Table>{this.renderTableHeader(this.props.locations)}{this.renderTableBody(locationsTodisplay)}</Table>)
  }

  renderTableHeader() {
    return (
      <Table.Header>
        {LocationsTable.keysToInclude.map( (key) => (<Table.HeaderCell>{key}</Table.HeaderCell>))}
      </Table.Header>
    )
  }

  renderTableBody(locations) {
    return <Table.Body>{locations.map(this.renderTableRow)}</Table.Body>;
  }

  renderTableRow(location) {
    return  <Table.Row>{LocationsTable.keysToInclude.map( (key) => <Table.Cell>{location[key]}</Table.Cell>)}</Table.Row>
  }
}

export default LocationsTable;