import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFlakeRedistribution,
  calculateOccupancyPercent,
  calculateReliabilityScore,
  countActiveFilters,
  filterMeets,
  generateRollingTotpCode,
} from './meetLogic';
import { FilterCriteria, MeetItem } from '../types/meet';

const SAMPLE_MEETS: MeetItem[] = [
  {
    id: 'meet-1',
    title: 'codeClubs Meet',
    subtitle: 'Open Source & System Design Jam',
    category: 'Community',
    typeLabel: 'Open Meet',
    venueName: 'Anna Nagar Tower Park',
    area: 'Anna Nagar',
    address: 'X-Block, 3rd Main Rd, Anna Nagar, Chennai',
    distanceKm: 3.4,
    dateTimeLabel: '6:00pm, 25th Aug',
    dateISO: '2026-08-25',
    time24: '18:00',
    arriveMinutes: 8,
    transportMode: 'Metro',
    escrowAmount: 0,
    occupiedSpots: 180,
    maxSpots: 200,
    hostName: 'Aravind Swamy',
    hostUid: '0014',
    hostReliability: 97,
    hostAvatarSeed: 'aravind',
    isSafeguardPlus: true,
    isLateNight: false,
    ageGroup: 'Young',
    genderGroup: 'Both',
    geofenceRadiusMeters: 250,
    coordinates: { lat: 13.085, lng: 80.21, mapX: 38, mapY: 32 },
    highlights: ['Free community sticker pack'],
  },
  {
    id: 'meet-2',
    title: 'Velammal Coding Contest',
    subtitle: 'Competitive Programming Sprint',
    category: 'Contest',
    typeLabel: 'Contest Meet',
    venueName: 'Peter England, Padi',
    area: 'Padi',
    address: 'MTH Road, Padi, Chennai',
    distanceKm: 11.2,
    dateTimeLabel: '6:00pm, 25th Aug',
    dateISO: '2026-08-25',
    time24: '18:00',
    arriveMinutes: 18,
    transportMode: 'Rapido',
    escrowAmount: 100,
    occupiedSpots: 18,
    maxSpots: 24,
    hostName: 'Karthik Subramanian',
    hostUid: '0042',
    hostReliability: 95,
    hostAvatarSeed: 'karthik',
    isSafeguardPlus: true,
    isLateNight: false,
    ageGroup: 'Young',
    genderGroup: 'Both',
    geofenceRadiusMeters: 150,
    coordinates: { lat: 13.098, lng: 80.184, mapX: 24, mapY: 26 },
    highlights: ['₹100 refundable escrow'],
  },
];

const DEFAULT_FILTERS: FilterCriteria = {
  searchQuery: '',
  dateMode: 'any',
  dateValue: '',
  timeValue: '',
  distanceKm: 25,
  categories: [],
  priceMode: 'all',
  ageGroup: 'All',
  genderGroup: 'Both',
  onlySafeguardPlus: false,
};

test('filterMeets filters accurately by distance, price, and category', () => {
  const within5km = filterMeets(SAMPLE_MEETS, { ...DEFAULT_FILTERS, distanceKm: 5 });
  assert.equal(within5km.length, 1);
  assert.equal(within5km[0].id, 'meet-1');

  const paidOnly = filterMeets(SAMPLE_MEETS, { ...DEFAULT_FILTERS, priceMode: 'paid' });
  assert.equal(paidOnly.length, 1);
  assert.equal(paidOnly[0].id, 'meet-2');

  const contestOnly = filterMeets(SAMPLE_MEETS, { ...DEFAULT_FILTERS, categories: ['Contest'] });
  assert.equal(contestOnly.length, 1);
  assert.equal(contestOnly[0].title, 'Velammal Coding Contest');
});

test('calculateOccupancyPercent computes bounded percentage', () => {
  assert.equal(calculateOccupancyPercent(180, 200), 90);
  assert.equal(calculateOccupancyPercent(3, 4), 75);
  assert.equal(calculateOccupancyPercent(0, 10), 0);
  assert.equal(calculateOccupancyPercent(12, 10), 100);
});

test('calculateReliabilityScore matches Jatin Kishore 25 created / 105 joined / 6 missed', () => {
  const score = calculateReliabilityScore(25, 105, 6);
  assert.equal(score, 94);
});

test('generateRollingTotpCode returns deterministic 6-digit code per epoch window', () => {
  const code1 = generateRollingTotpCode('meet-1', 1000);
  const code2 = generateRollingTotpCode('meet-1', 1000);
  const codeNextWindow = generateRollingTotpCode('meet-1', 1001);
  assert.equal(code1.length, 6);
  assert.equal(code1, code2);
  assert.notEqual(code1, codeNextWindow);
});

test('calculateFlakeRedistribution splits flaked escrow among punctual attendees', () => {
  const result = calculateFlakeRedistribution(100, 2, 4);
  assert.equal(result.totalPool, 200);
  assert.equal(result.platformFee, 20);
  assert.equal(result.perAttendeeCredit, 45);
});

test('countActiveFilters counts non-default filter selections', () => {
  assert.equal(countActiveFilters(DEFAULT_FILTERS), 0);
  assert.equal(
    countActiveFilters({
      ...DEFAULT_FILTERS,
      distanceKm: 10,
      priceMode: 'paid',
      categories: ['Playground', 'Food'],
    }),
    4
  );
});
