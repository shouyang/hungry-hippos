import React from "react";
import L from "leaflet";

import { Map, Marker, Popup, TileLayer, Circle } from "react-leaflet";

const commonIconProperties = {
  iconSize: [18, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -30],
  shadowSize: [25, 25],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
};

const greenIcon = new L.Icon({
  ...commonIconProperties,
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
});

const yellowIcon = new L.Icon({
  ...commonIconProperties,
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
});

const redIcon = new L.Icon({
  ...commonIconProperties,
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
});

const orangeIcon = new L.Icon({
  ...commonIconProperties,
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
});

const statusIcons = {
  Open: greenIcon,
  "Appears Closed": orangeIcon,
  Closed: redIcon,
  "": yellowIcon,
};

class LocationsMap extends React.Component {
  // Leaflet map used to display locations. Uses a combination of 'leaflet' and 'react-leaflet' to render.

  render() {
    const userPosition = [this.props.lat, this.props.lng];
    const locationsWithMapData = this.props.locations.filter((location) => {
      return location.hasLocationData() && location.shouldBeShown;
    });

    return (
      <Map center={userPosition} zoom={this.props.zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userPosition} draggable={true} onDragend={this.props.handleMarkerDragEnd}>
          <Popup>
            <p>
              You can drag this around to filter for locations nearby! Alternatively, click on the "My
              Location" button to set this to your current location.
            </p>
          </Popup>
        </Marker>
        <Circle center={userPosition} radius={this.props.filterRadius * 1000} />
        {locationsWithMapData.map(this.renderLocationMarker.bind(this))}
      </Map>
    );
  }

  renderLocationMarker = (location) => {
    // Helper function to render location map markers.
    const generateBoldedField = (label, data) => (
      <div>
        <b>{label}: </b>
        {data || "--"}
      </div>
    );

    const icon = statusIcons[location.status] || yellowIcon;

    const websiteLink = location.website ? <a href={location.website}>ResturantWebsite</a> : "";
    const deliverySiteLink = location.deliverySite ? <a href={location.deliverySite}>Delivery</a> : "";
    const fantuanLink = location.fantuan ? <a href={location.fantuan}>Fantuan</a> : "";

    return (
      <Marker
        ref={(ref) => this.props.setRef(location.name, ref)}
        key={location.name}
        position={[location.lat, location.long]}
        icon={icon}
      >
        <Popup>
          <h5>{location.name}</h5>
          <span>
            <a href={location.googleMapsLink}>GoogleMaps</a> {websiteLink} {deliverySiteLink} {fantuanLink}
          </span>
          <hr />
          {generateBoldedField("Address", location.address)}
          {generateBoldedField("Hours", location.hours)}
          {generateBoldedField("Cusine", location.cusine)}
          {generateBoldedField("Notes", location.comments)}
        </Popup>
      </Marker>
    );
  };
}

export default LocationsMap;
