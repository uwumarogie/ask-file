export const serverLocations = [
  {
    region: "us-east-1",
    cloud: "aws",
    latitude: 37.4138,
    longitude: -78.6305,
  }, // Virginia
  {
    region: "us-west-2",
    cloud: "aws",
    latitude: 45.5235,
    longitude: -122.6764,
  }, // Oregon
  {
    region: "eu-west-1",
    cloud: "aws",
    latitude: 53.4129,
    longitude: -8.2439,
  }, // Ireland
  {
    region: "us-central",
    cloud: "gcp",
    latitude: 41.878,
    longitude: -93.0977,
  }, // Iowa
  {
    region: "europe-west",
    cloud: "gcp",
    latitude: 52.1326,
    longitude: 5.2913,
  }, // Netherlands
  {
    region: "eastus2",
    cloud: "azure",
    latitude: 37.3719,
    longitude: -79.8164,
  }, // Virginia
];

export function computeDistanceHaversine(
  userLatitude: number,
  userLongitude: number,
  serverLatitude: number,
  serverLongitude: number,
) {
  const EARTH_RADIUS = 6371;
  const latDifference = (serverLatitude - userLatitude) * (Math.PI / 180);
  const lonDifference = (serverLongitude - userLongitude) * (Math.PI / 180);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(userLatitude * (Math.PI / 180)) *
      Math.cos(serverLongitude * (Math.PI / 180)) *
      Math.sin(lonDifference / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}
