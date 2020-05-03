import React from "react";

import { Table, Label } from "semantic-ui-react";

class LocationsTable extends React.Component {
  // Renders a table from an array of locations.

  // Table to display list of locations
  static keysToInclude = [
    "name",
    "status",
    "cusine",
    "hours",
    "delivery",
    "pickup",
    "giftcards",
    "dietaryNeeds",
    "comments",
  ];

  static keysToColumnNames = {
    name: "Business Name",
    status: "Status",
    cusine: "Cusine",
    hours: "Hours",
    delivery: "Delivery",
    pickup: "Pickup",
    giftcards: "Gift Cards",
    dietaryNeeds: "Diet Needs",
    address: "Address",
    comments: "Notes",
  };

  render() {
    const locationsTodisplay = this.props.locations.filter((location) => location.shouldBeShown);

    return (
      <Table>
        <Table.Header>
          {LocationsTable.keysToInclude.map((key) => (
            <Table.HeaderCell key={`header:${key}`}>{LocationsTable.keysToColumnNames[key]}</Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>{locationsTodisplay.map(this.renderTableRow)}</Table.Body>;
      </Table>
    );
  }

  renderTableRow = (location) => {
    const locationHasSkipOrUberEats = !!location.deliverySite;
    const locationHasFantuan = !!location.fantuan;
    const deliveryIsUberEats = !!location.deliverySite && location.deliverySite.includes("ubereats.com");
    return (
      <Table.Row
        key={location.name}
        className="location-data-row"
        onClick={() => this.props.onRowClick(location.name)}
      >
        {LocationsTable.keysToInclude.map((key) => {
          if (key === "delivery" && locationHasSkipOrUberEats) {
            return (
              <Table.Cell>
                <Label
                  as="a"
                  href={location.deliverySite}
                  color={deliveryIsUberEats ? "green" : "red"}
                  size="mini"
                >
                  {deliveryIsUberEats ? "UberEats" : "SkipTheDishes"}
                </Label>
                {locationHasFantuan ? (
                  <Label as="a" href={location.fantuan} color="yellow" size="mini">
                    Fantuan
                  </Label>
                ) : (
                  ""
                )}
              </Table.Cell>
            );
          }

          return <Table.Cell key={`${location.name}:${key}`}>{location[key]}</Table.Cell>;
        })}
      </Table.Row>
    );
  };
}

export default LocationsTable;
