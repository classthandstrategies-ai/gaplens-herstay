import { EmploymentHub } from '../types';

export const EMPLOYMENT_HUBS: EmploymentHub[] = [
  {
    id: 'manyata-tech-park-blr',
    name: 'Manyata Tech Park',
    cityKey: 'bengaluru',
    cityName: 'Bengaluru',
    landmark: 'Nagawara / Hebbal Outer Ring Road',
    // Actual verified coordinates for Manyata Embassy Business Park Main Gate
    coordinates: {
      lat: 13.0475,
      lng: 77.622,
    },
    defaultRadiusKm: 3.5,
    maxRadiusKm: 8.0,
    primaryQueries: [
      'ladies PG near Manyata Tech Park Bengaluru',
      'working women hostel near Manyata Tech Park',
      'women PG accommodation near Nagawara Bengaluru',
      'girls PG Thanisandra Main Road Bengaluru',
    ],
    description:
      'One of Asia’s largest operational business parks hosting over 150,000 workforce members across IT, engineering, and finance.',
    notableEmployers: [
      'IBM',
      'Cognizant',
      'Target India',
      'Rolls-Royce',
      'Philips',
      'Nokia',
      'Fidelity Investments',
      'L Brands',
    ],
  },
  {
    id: 'hinjewadi-it-park-pune',
    name: 'Hinjewadi Rajiv Gandhi Infotech Park',
    cityKey: 'pune',
    cityName: 'Pune',
    landmark: 'Phase 1 & Phase 2, Hinjewadi',
    // Verified coordinates for Hinjewadi Phase 1 Circle
    coordinates: {
      lat: 18.5913,
      lng: 73.7389,
    },
    defaultRadiusKm: 4.0,
    maxRadiusKm: 9.0,
    primaryQueries: [
      'ladies PG near Hinjewadi Pune',
      'working women hostel Hinjewadi Phase 1',
      'girls PG accommodation Wakad Hinjewadi',
    ],
    description:
      'Premier 2,800-acre IT hub employing over 200,000 professionals across three major phases with high demand for safe, transit-friendly housing.',
    notableEmployers: [
      'Infosys',
      'Wipro',
      'Tata Consultancy Services',
      'Tech Mahindra',
      'Cognizant',
      'Persistent Systems',
    ],
  },
  {
    id: 'gachibowli-financial-district-hyd',
    name: 'Gachibowli & Financial District',
    cityKey: 'hyderabad',
    cityName: 'Hyderabad',
    landmark: 'Nanakramguda / Gachibowli Junction',
    // Verified coordinates for Gachibowli - Financial District corridor
    coordinates: {
      lat: 17.4401,
      lng: 78.3489,
    },
    defaultRadiusKm: 4.5,
    maxRadiusKm: 10.0,
    primaryQueries: [
      'ladies PG near Gachibowli Hyderabad',
      'women hostel Financial District Hyderabad',
      'girls PG accommodation Nanakramguda Hyderabad',
    ],
    description:
      'Major global tech and banking corridor with modern campuses and rapidly expanding workforce housing needs.',
    notableEmployers: [
      'Microsoft India R&D',
      'Amazon Campus',
      'Google India',
      'Deloitte',
      'Capgemini',
      'ICICI Bank Hub',
    ],
  },
];

export function getHubById(id: string): EmploymentHub | undefined {
  return EMPLOYMENT_HUBS.find((h) => h.id === id);
}

export function getDefaultHub(): EmploymentHub {
  return EMPLOYMENT_HUBS[0]; // Manyata Tech Park
}
