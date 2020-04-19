export const urls = {
  spreadsheetID: "1YvbMUEEGha3hEQ6CDd0K1C4WVkAMmszbBRuRQ-ndxKU",
  worksheetID: "oc6o2es",
  get googleSheetsURL() {
    return `https://spreadsheets.google.com/feeds/list/${this.spreadsheetID}/${this.worksheetID}/public/values?alt=json`;
  },
};

export const cssClasses = {
  mapContainer: "map-container",
  mapControls: "map-buttons",
  mapButtons: "ui button",
};

export const defaultStates = {
  app: {
    isFilterSet: false,
    locations: [],
    lat: 53.5461,
    lng: -113.4938,
    zoom: 11,
    filterRadius: 5,
  },
};

export const defaultProps = {
  locationSlider: {
    type: "range",
    labelPosition: "right",

    min: 1,
    max: 10,
    step: 0.1,
  },
};

export const simpleStyles = {
  greenFloatLeft: { backgroundColor: "limegreen", float: "left" },
  greenFloatRight: { backgroundColor: "limegreen", float: "right" },
};

export const labels = {
  getCurrentLocation: "Get My Location",
  filterNearLocation: "Filter Near Location",
  resetLocationFilter: "Reset Location Filter",
};
