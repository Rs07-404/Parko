export interface IParkingSpot {
  _id: string;
  spotNumber: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [latitude, longitude]
  };
  status: 'available' | 'occupied';
  sensorId?: string;
  createdAt?: string;
  updatedAt?: string;
}