import React from 'react';

import { Table } from 'semantic-ui-react'

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

export default LocationsTable;