function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  const { sin, cos, sqrt, atan2, PI } = Math;
  function degreesToRadians(degrees) {
    return (degrees * PI) / 180;
  }

  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const lat1x = degreesToRadians(lat1);
  const lat2x = degreesToRadians(lat2);

  const a = sin(dLat / 2) * sin(dLat / 2) + sin(dLon / 2) * sin(dLon / 2) * cos(lat1x) * cos(lat2x);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));
  return earthRadiusKm * c;
}

class Location {
  // Data class representing one row from the Google Sheets Document.
  constructor(entry) {
    function getGSXValue(key) {
      return entry[`gsx$${key}`].$t;
    }
    // Unpacks interesting entries from the Google Sheets JSON API into a simpler object.
    this.id = entry.id.$t;
    this.shouldBeShown = true;

    this.name = getGSXValue("name");
    this.status = getGSXValue("status");
    this.cusine = getGSXValue("cusine");
    this.area = getGSXValue("area");
    this.hours = getGSXValue("hours-unsureofcovid-19hours");
    this.delivery = getGSXValue("delivery");
    this.pickup = getGSXValue("pickup");
    this.giftcards = getGSXValue("giftcards");
    this.dietaryNeeds = getGSXValue("dietaryneedsserved");
    this.address = getGSXValue("address");
    this.comments = getGSXValue("comments");
    this.website = getGSXValue("website");
    this.deliverySite = getGSXValue("deliverysite");
    this.lat = getGSXValue("lat");
    this.long = getGSXValue("long");
  }

  hasLocationData() {
    return !!this.lat && !!this.long;
  }

  distanceToLocationMeters(lat, long) {
    return distanceInKmBetweenEarthCoordinates(lat, long, this.lat, this.long) * 1000;
  }

  get googleMapsLink() {
    return `https://google.com/maps/search/${this.address}`;
  }

  // TODO: Probably add some functionality to unpack attributes (addresses, hours, cusine types etc...)
  // TODO: Maybe add resolvers to Google Maps, Food Delivery etc...
}

export default Location;
