export interface IBoundary {
    type: 'Polygon';
    coordinates: Array<Array<[number, number]>>; // Array of coordinate pairs [lng, lat]
  }