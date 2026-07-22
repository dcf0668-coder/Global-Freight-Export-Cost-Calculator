import { Port } from "@/types";

export const ports: Port[] = [
  { id: "cn-sha", name: "Port of Shanghai", unlocode: "CNSHA", countryId: "cn", countryName: "China", latitude: 31.2304, longitude: 121.4737, nearbyAirports: ["Shanghai Pudong Intl (PVG)"], nearbyWarehouses: ["Waigaoqiao Free Trade Zone"], roroAvailable: true, containerAvailable: true },
  { id: "cn-ngb", name: "Port of Ningbo-Zhoushan", unlocode: "CNNGB", countryId: "cn", countryName: "China", latitude: 29.868, longitude: 121.544, nearbyAirports: ["Ningbo Lishe Intl (NGB)"], nearbyWarehouses: ["Beilun Logistics Park"], roroAvailable: true, containerAvailable: true },
  { id: "cn-shz", name: "Port of Shenzhen", unlocode: "CNSZX", countryId: "cn", countryName: "China", latitude: 22.5431, longitude: 114.0579, nearbyAirports: ["Shenzhen Bao'an Intl (SZX)"], nearbyWarehouses: ["Yantian Bonded Zone"], roroAvailable: false, containerAvailable: true },
  { id: "cn-gzh", name: "Port of Guangzhou", unlocode: "CNGZG", countryId: "cn", countryName: "China", latitude: 23.1291, longitude: 113.2644, nearbyAirports: ["Guangzhou Baiyun Intl (CAN)"], nearbyWarehouses: ["Nansha Bonded Port"], roroAvailable: true, containerAvailable: true },
  { id: "us-lax", name: "Port of Los Angeles", unlocode: "USLAX", countryId: "us", countryName: "United States", latitude: 33.7406, longitude: -118.2706, nearbyAirports: ["LAX"], nearbyWarehouses: ["Inland Empire DC Corridor"], roroAvailable: true, containerAvailable: true },
  { id: "us-nyc", name: "Port of New York/New Jersey", unlocode: "USNYC", countryId: "us", countryName: "United States", latitude: 40.6892, longitude: -74.0445, nearbyAirports: ["JFK", "EWR"], nearbyWarehouses: ["Port Newark Distribution"], roroAvailable: true, containerAvailable: true },
  { id: "us-sav", name: "Port of Savannah", unlocode: "USSAV", countryId: "us", countryName: "United States", latitude: 32.0809, longitude: -81.0912, nearbyAirports: ["Savannah/Hilton Head Intl"], nearbyWarehouses: ["Savannah Logistics Park"], roroAvailable: true, containerAvailable: true },
  { id: "gb-fxt", name: "Port of Felixstowe", unlocode: "GBFXT", countryId: "gb", countryName: "United Kingdom", latitude: 51.9542, longitude: 1.3464, nearbyAirports: ["London Stansted"], nearbyWarehouses: ["Suffolk Distribution Park"], roroAvailable: false, containerAvailable: true },
  { id: "gb-sou", name: "Port of Southampton", unlocode: "GBSOU", countryId: "gb", countryName: "United Kingdom", latitude: 50.8998, longitude: -1.4044, nearbyAirports: ["Southampton"], nearbyWarehouses: ["Solent Logistics Hub"], roroAvailable: true, containerAvailable: true },
  { id: "ae-jea", name: "Jebel Ali Port", unlocode: "AEJEA", countryId: "ae", countryName: "United Arab Emirates", latitude: 25.0119, longitude: 55.0617, nearbyAirports: ["Al Maktoum Intl (DWC)"], nearbyWarehouses: ["JAFZA Free Zone"], roroAvailable: true, containerAvailable: true },
  { id: "ng-lag", name: "Lagos (Apapa) Port", unlocode: "NGLOS", countryId: "ng", countryName: "Nigeria", latitude: 6.4531, longitude: 3.3958, nearbyAirports: ["Murtala Muhammed Intl"], nearbyWarehouses: ["Apapa Bonded Terminal"], roroAvailable: true, containerAvailable: true },
  { id: "au-syd", name: "Port Botany (Sydney)", unlocode: "AUSYD", countryId: "au", countryName: "Australia", latitude: -33.9645, longitude: 151.2166, nearbyAirports: ["Sydney Kingsford Smith"], nearbyWarehouses: ["Port Botany Logistics Estate"], roroAvailable: true, containerAvailable: true },
  { id: "au-mel", name: "Port of Melbourne", unlocode: "AUMEL", countryId: "au", countryName: "Australia", latitude: -37.8136, longitude: 144.9184, nearbyAirports: ["Melbourne Tullamarine"], nearbyWarehouses: ["Dynon Rail Terminal"], roroAvailable: true, containerAvailable: true },
  { id: "br-san", name: "Port of Santos", unlocode: "BRSSZ", countryId: "br", countryName: "Brazil", latitude: -23.9608, longitude: -46.3339, nearbyAirports: ["Sao Paulo Guarulhos"], nearbyWarehouses: ["Santos Bonded Warehouse District"], roroAvailable: true, containerAvailable: true },
  { id: "de-ham", name: "Port of Hamburg", unlocode: "DEHAM", countryId: "de", countryName: "Germany", latitude: 53.5459, longitude: 9.9695, nearbyAirports: ["Hamburg Airport"], nearbyWarehouses: ["Hamburg Free Port"], roroAvailable: true, containerAvailable: true },
  { id: "in-nsa", name: "Nhava Sheva (JNPT)", unlocode: "INNSA", countryId: "in", countryName: "India", latitude: 18.9633, longitude: 72.9497, nearbyAirports: ["Mumbai Chhatrapati Shivaji"], nearbyWarehouses: ["JNPT SEZ"], roroAvailable: false, containerAvailable: true },
];

export function getPortById(id: string): Port | undefined {
  return ports.find((p) => p.id === id);
}

export function getPortsByCountry(countryId: string): Port[] {
  return ports.filter((p) => p.countryId === countryId);
}
