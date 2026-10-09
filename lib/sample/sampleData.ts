import { PlaceListing, EmploymentHub } from '../types';
import { calculateHaversineDistanceKm } from '../geo/distance';

/**
 * High-fidelity illustrative dataset for Manyata Tech Park Bengaluru
 * Coordinates around Nagawara, Hebbal, Thanisandra, Veerannapalya.
 * Real geographic locations accurately positioned relative to Manyata Main Gate.
 */
const MANYATA_SAMPLE_LISTINGS: Omit<PlaceListing, 'distanceKm'>[] = [
  {
    id: 'sample-blr-1',
    dataId: '0x3bae17001a1b2c3d:0x1111111111111111',
    placeId: 'ChIJz2x0_sample_blr_1',
    title: 'Sri Balaji Luxury Ladies PG',
    address: 'Near Gate 1, Manyata Residency, Nagawara, Bengaluru, Karnataka 560045',
    rating: 3.6,
    reviewCount: 84,
    coordinates: { lat: 13.0489, lng: 77.6205 }, // ~0.2 km from hub
    category: "Women's PG & Hostel",
    price: '₹9,500 - ₹14,000 / mo',
    link: 'https://maps.google.com/?cid=1111111111111111',
    reviewsSample: [
      {
        id: 'rev-blr-1-1',
        author: 'Priyanka M.',
        rating: 2,
        date: '2 months ago',
        text: 'The location is walking distance to Manyata Gate 1 which is great. But the bathrooms are very dirty and nobody cleans regularly. We complained three times about cockroach infestation in the kitchen and wardens did nothing.',
      },
      {
        id: 'rev-blr-1-2',
        author: 'Ananya S.',
        rating: 3,
        date: '4 months ago',
        text: 'Food is okay for dinner but breakfast has no variety. Also washing machine is frequently broken and hot water stops after 8 AM. Rent is high for this poor maintenance.',
      },
      {
        id: 'rev-blr-1-3',
        author: 'Divya R.',
        rating: 4,
        date: '6 months ago',
        text: 'Good wifi connection and peaceful environment for work from home. Very close to IBM office.',
      },
    ],
  },
  {
    id: 'sample-blr-2',
    dataId: '0x3bae17001a1b2c3d:0x2222222222222222',
    placeId: 'ChIJz2x0_sample_blr_2',
    title: 'Sai Comforts Executive Women Hostel',
    address: 'Thanisandra Main Rd, near Elements Mall, Nagawara, Bengaluru 560077',
    rating: 3.2,
    reviewCount: 112,
    coordinates: { lat: 13.0435, lng: 77.6272 }, // ~0.7 km
    category: "Women's Hostel",
    price: '₹8,500 - ₹12,500 / mo',
    link: 'https://maps.google.com/?cid=2222222222222222',
    reviewsSample: [
      {
        id: 'rev-blr-2-1',
        author: 'Swathi K.',
        rating: 1,
        date: '1 month ago',
        text: 'Worst management experience. When vacating, the owner refused to return my ₹5,000 security deposit citing imaginary painting charges. Money minded management, please get written proof before giving advance.',
      },
      {
        id: 'rev-blr-2-2',
        author: 'Megha P.',
        rating: 2,
        date: '3 months ago',
        text: 'The caretaker is very rude and enters the corridor without knocking. Zero privacy for working professionals. Electricity bill is charged at absurd commercial rates per unit.',
      },
      {
        id: 'rev-blr-2-3',
        author: 'Tanvi N.',
        rating: 3,
        date: '5 months ago',
        text: 'Near Elements Mall and bus stop. Food quality has degraded over time, dal is very watery.',
      },
    ],
  },
  {
    id: 'sample-blr-3',
    dataId: '0x3bae17001a1b2c3d:0x3333333333333333',
    placeId: 'ChIJz2x0_sample_blr_3',
    title: 'Zolo Starlight Ladies Living',
    address: 'Govindapura Main Rd, Nagawara, Bengaluru, Karnataka 560045',
    rating: 4.1,
    reviewCount: 198,
    coordinates: { lat: 13.0398, lng: 77.6189 }, // ~0.9 km
    category: "Managed Co-living",
    price: '₹12,000 - ₹18,000 / mo',
    link: 'https://maps.google.com/?cid=3333333333333333',
    reviewsSample: [
      {
        id: 'rev-blr-3-1',
        author: 'Deepika J.',
        rating: 4,
        date: '3 weeks ago',
        text: 'Clean premises and app-based maintenance works well. However the approach road from Manyata back gate is poorly lit at night with no street lights and stray dogs. Returning after 9 PM shift requires a cab even for a short distance.',
      },
      {
        id: 'rev-blr-3-2',
        author: 'Kavya V.',
        rating: 4,
        date: '2 months ago',
        text: 'High speed wifi and clean washrooms. Very strict guest rules, but good security guard at entry gate.',
      },
    ],
  },
  {
    id: 'sample-blr-4',
    dataId: '0x3bae17001a1b2c3d:0x4444444444444444',
    placeId: 'ChIJz2x0_sample_blr_4',
    title: 'Vaishnavi Elegant Ladies PG',
    address: 'Veerannapalya Main Rd, near Manyata Gate 5, Bengaluru 560045',
    rating: 3.5,
    reviewCount: 67,
    coordinates: { lat: 13.0452, lng: 77.6115 }, // ~1.2 km
    category: "Ladies PG",
    price: '₹7,500 - ₹11,000 / mo',
    link: 'https://maps.google.com/?cid=4444444444444444',
    reviewsSample: [
      {
        id: 'rev-blr-4-1',
        author: 'Shalini B.',
        rating: 2,
        date: '1 month ago',
        text: 'Frequent power cuts and the backup inverter does not support room plugs or geyser. Water shortage twice every week. Cleaning is irregular.',
      },
      {
        id: 'rev-blr-4-2',
        author: 'Sneha L.',
        rating: 3,
        date: '4 months ago',
        text: 'Budget friendly rent compared to others nearby. Food is strictly South Indian style, Northern colleagues find it repetitive.',
      },
    ],
  },
  {
    id: 'sample-blr-5',
    dataId: '0x3bae17001a1b2c3d:0x5555555555555555',
    placeId: 'ChIJz2x0_sample_blr_5',
    title: 'NestStay Premium Women Residency',
    address: 'Outer Ring Rd, Hebbal Kempapura, Bengaluru, Karnataka 560024',
    rating: 3.8,
    reviewCount: 142,
    coordinates: { lat: 13.0535, lng: 77.6012 }, // ~2.3 km
    category: "Serviced Living",
    price: '₹13,500 - ₹21,000 / mo',
    link: 'https://maps.google.com/?cid=5555555555555555',
    reviewsSample: [
      {
        id: 'rev-blr-5-1',
        author: 'Nandini T.',
        rating: 3,
        date: '2 months ago',
        text: 'Rooms are spacious and well ventilated. But the location requires crossing the heavy Hebbal flyover traffic junction. Auto drivers refuse short meter trips to Manyata Gate 2 in the morning.',
      },
      {
        id: 'rev-blr-5-2',
        author: 'Ritika C.',
        rating: 4,
        date: '5 months ago',
        text: 'Good hygienic food and biometric entry. Deposit refund took 3 weeks of continuous follow ups with the manager.',
      },
    ],
  },
  {
    id: 'sample-blr-6',
    dataId: '0x3bae17001a1b2c3d:0x6666666666666666',
    placeId: 'ChIJz2x0_sample_blr_6',
    title: 'Gowri Comforts Working Women PG',
    address: 'Near Coffee Board Layout, Kempapura, Hebbal, Bengaluru 560024',
    rating: 3.4,
    reviewCount: 53,
    coordinates: { lat: 13.0578, lng: 77.6075 }, // ~1.9 km
    category: "Working Women Hostel",
    price: '₹8,000 - ₹11,500 / mo',
    link: 'https://maps.google.com/?cid=6666666666666666',
    reviewsSample: [
      {
        id: 'rev-blr-6-1',
        author: 'Aishwarya G.',
        rating: 2,
        date: '3 months ago',
        text: 'Plumbing issues in third floor rooms. Tap broken and water leakage took three weeks to fix despite several reminders. Room size is very small for triple sharing.',
      },
      {
        id: 'rev-blr-6-2',
        author: 'Bhavana M.',
        rating: 3,
        date: '6 months ago',
        text: 'Quiet residential neighborhood, but difficult to find cabs or autos late night. Dinner timing is strict 8 PM to 9:30 PM only.',
      },
    ],
  },
  {
    id: 'sample-blr-7',
    dataId: '0x3bae17001a1b2c3d:0x7777777777777777',
    placeId: 'ChIJz2x0_sample_blr_7',
    title: 'Mahalakshmi Grand Ladies PG',
    address: 'Telecom Layout, Thanisandra, Bengaluru 560077',
    rating: 3.7,
    reviewCount: 91,
    coordinates: { lat: 13.0612, lng: 77.6295 }, // ~1.7 km
    category: "Ladies PG",
    price: '₹8,500 - ₹13,000 / mo',
    link: 'https://maps.google.com/?cid=7777777777777777',
    reviewsSample: [
      {
        id: 'rev-blr-7-1',
        author: 'Puja S.',
        rating: 3,
        date: '1 month ago',
        text: 'Food is tasty and staff is cooperative. However, the wifi connection drops frequently in the evening during client calls. Bedbugs were noticed in mattresses last month.',
      },
      {
        id: 'rev-blr-7-2',
        author: 'Rashmi D.',
        rating: 4,
        date: '4 months ago',
        text: 'Good proximity to Manyata North Gate via Thanisandra road. Clean rooms and CCTV at entry.',
      },
    ],
  },
  {
    id: 'sample-blr-8',
    dataId: '0x3bae17001a1b2c3d:0x8888888888888888',
    placeId: 'ChIJz2x0_sample_blr_8',
    title: 'Green Leaf Executive Girls Stay',
    address: 'HBR Layout 4th Block, near Hennur Cross, Bengaluru 560043',
    rating: 3.9,
    reviewCount: 104,
    coordinates: { lat: 13.0315, lng: 77.6345 }, // ~2.2 km
    category: "Executive PG",
    price: '₹10,500 - ₹16,000 / mo',
    link: 'https://maps.google.com/?cid=8888888888888888',
    reviewsSample: [
      {
        id: 'rev-blr-8-1',
        author: 'Monika K.',
        rating: 3,
        date: '2 months ago',
        text: 'Spacious balcony rooms and decent food. Commute to Manyata by BMTC bus takes 20-30 minutes because of traffic near Nagawara signal.',
      },
      {
        id: 'rev-blr-8-2',
        author: 'Arpita V.',
        rating: 4,
        date: '5 months ago',
        text: 'Helpful warden and clean dining area. Rent increased suddenly without prior 30-day notice.',
      },
    ],
  },
];

/**
 * Returns illustrative sample listings computed with accurate straight-line distances
 * to the specified hub.
 */
export function getSampleListingsForHub(hub: EmploymentHub): PlaceListing[] {
  // If Manyata, use the calibrated Nagawara/Hebbal listings
  if (hub.id === 'manyata-tech-park-blr') {
    return MANYATA_SAMPLE_LISTINGS.map((listing) => ({
      ...listing,
      distanceKm: calculateHaversineDistanceKm(hub.coordinates, listing.coordinates),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // For Hinjewadi or Gachibowli, synthesize geographically coherent sample offsets
  // around their verified center coordinate
  const offsets = [
    { title: 'Prathamesh Executive Ladies PG', latOffset: 0.003, lngOffset: -0.004, rating: 3.5, reviews: 72 },
    { title: 'Sri Sai Ram Working Women Hostel', latOffset: -0.005, lngOffset: 0.006, rating: 3.3, reviews: 94 },
    { title: 'Elite Grace Women Co-Living', latOffset: 0.008, lngOffset: 0.002, rating: 4.1, reviews: 140 },
    { title: 'Annapurna Comforts PG', latOffset: -0.008, lngOffset: -0.007, rating: 3.2, reviews: 58 },
    { title: 'Royal Palms Ladies Stay', latOffset: 0.012, lngOffset: -0.009, rating: 3.7, reviews: 85 },
    { title: 'Silver Oak Executive Hostel', latOffset: -0.014, lngOffset: 0.011, rating: 3.6, reviews: 66 },
  ];

  return offsets.map((item, idx) => {
    const coords = {
      lat: hub.coordinates.lat + item.latOffset,
      lng: hub.coordinates.lng + item.lngOffset,
    };
    const distanceKm = calculateHaversineDistanceKm(hub.coordinates, coords);

    return {
      id: `sample-${hub.cityKey}-${idx + 1}`,
      dataId: `0x${hub.cityKey}000000:0x${idx + 1}`,
      placeId: `ChIJ_${hub.cityKey}_${idx + 1}`,
      title: item.title,
      address: `Sector Road, near ${hub.name}, ${hub.cityName}`,
      rating: item.rating,
      reviewCount: item.reviews,
      coordinates: coords,
      distanceKm,
      category: "Women's PG & Hostel",
      price: '₹8,500 - ₹14,000 / mo',
      link: 'https://maps.google.com',
      reviewsSample: [
        {
          id: `rev-${hub.cityKey}-${idx}-1`,
          author: 'Sample Reviewer',
          rating: 2,
          date: '2 months ago',
          text: 'Bathrooms are dirty and cleaning is not regular. Caretaker is rude when we ask for deposit refund.',
        },
        {
          id: `rev-${hub.cityKey}-${idx}-2`,
          author: 'IT Professional',
          rating: 3,
          date: '3 months ago',
          text: `Walking distance to ${hub.name} offices, but wifi goes down during evening work shifts. Food is average.`,
        },
      ],
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
