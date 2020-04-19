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
        <Marker position={userPosition} draggable={true} onDragend={this.props.handleMarkerDragEnd} />
        <Circle center={userPosition} radius={this.props.filterRadius * 1000} />
        {locationsWithMapData.map(this.renderLocationMarker.bind(this))}
      </Map>
    );
  }

  renderLocationMarker(location) {
    // Helper function to render location map markers.

    const icon = statusIcons[location.status] || yellowIcon;

    return (
      <Marker position={[location.lat, location.long]} icon={icon}>
        <Popup>
          {location.name} {location.distanceToLocationMeters(this.props.lat, this.props.lng)}
        </Popup>
      </Marker>
    );
  }
}

export default LocationsMap;
