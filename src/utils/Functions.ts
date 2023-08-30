import { LatLng } from "leaflet";

export const calculateDistanceBetweenTwoPoints = (pointA: LatLng, pointB: LatLng): number => {
    const R = 6371.0; // earth ray in km
    const radLat1 = (Math.PI * pointA.lat) / 180;
    const radLon1 = (Math.PI * pointA.lng) / 180;
    const radLat2 = (Math.PI * pointB.lat) / 180;
    const radLon2 = (Math.PI * pointB.lng) / 180;

    const dLon = radLon2 - radLon1;
    const dLat = radLat2 - radLat1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}