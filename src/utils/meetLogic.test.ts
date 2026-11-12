import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFlakeRedistribution,
  calculateOccupancyPercent,
  calculateReliabilityScore,
  countActiveFilters,
  DEFAULT_RANDOM_PRESETS,
  filterClientHistoryByStatus,
  filterMeets,
  formatHostDateTimeLabel,
  formatPresetLabel,
  generateRollingTotpCode,
  getEventCtaCopy,
  getMeetCheckInMode,
  getNextBookedMeet,
  getRemainingTimeUrgency,
  isMeetHostedByUser,
  pickRandomMeetByPreset,
  summarizeClientMapStats,
} from './meetLogic';
import { VIBE_PALETTES, getVibePaletteById } from '../data/vibePalettes';
import {
  CATEGORY_TYPOGRAPHY_MAP,
  resolveMeetTypography,
  getNextTypographyVariant,
} from './typographyStyles';
import { FilterCriteria, MeetCategory, MeetItem, TrackHistoryEntry } from '../types/meet';

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

test('filterClientHistoryByStatus and summarizeClientMapStats handle client previous meets map data', () => {
  const sampleHistory: TrackHistoryEntry[] = [
    {
      id: 'h1',
      dateLabel: '25-08-26',
      timeLabel: '6:00pm',
      meetTitle: 'Cricket Meet',
      venueName: 'Nehru Stadium',
      area: 'Park Town',
      category: 'Playground',
      status: 'Joined',
      escrowDelta: 45,
      coordinates: { lat: 13.0865, lng: 80.2728, mapX: 62, mapY: 22 },
    },
    {
      id: 'h2',
      dateLabel: '21-08-26',
      timeLabel: '6:00pm',
      meetTitle: 'Turf Box Cricket',
      venueName: 'Nehru Stadium Gate 3',
      area: 'Periyamet',
      category: 'Playground',
      status: 'Missed',
      escrowDelta: -100,
      coordinates: { lat: 13.084, lng: 80.275, mapX: 74, mapY: 33 },
    },
    {
      id: 'h3',
      dateLabel: '18-08-26',
      timeLabel: '5:30pm',
      meetTitle: 'codeClubs Meet',
      venueName: 'Anna Nagar Tower Park',
      area: 'Anna Nagar',
      category: 'Community',
      status: 'Hosted',
      escrowDelta: 90,
      coordinates: { lat: 13.085, lng: 80.2101, mapX: 36, mapY: 28 },
    },
  ];

  assert.equal(filterClientHistoryByStatus(sampleHistory, 'All').length, 3);
  assert.equal(filterClientHistoryByStatus(sampleHistory, 'Joined').length, 1);
  assert.equal(filterClientHistoryByStatus(sampleHistory, 'Hosted').length, 1);
  assert.equal(filterClientHistoryByStatus(sampleHistory, 'Missed').length, 1);

  const summary = summarizeClientMapStats(sampleHistory);
  assert.equal(summary.total, 3);
  assert.equal(summary.joined, 1);
  assert.equal(summary.hosted, 1);
  assert.equal(summary.missed, 1);
  assert.equal(summary.netEscrowDelta, 35);
});

test('getRemainingTimeUrgency returns green, yellow, and red colors based on close timer', () => {
  assert.equal(getRemainingTimeUrgency(28).level, 'green');
  assert.equal(getRemainingTimeUrgency(14).level, 'yellow');
  assert.equal(getRemainingTimeUrgency(5).level, 'red');

  const bookedList: MeetItem[] = [
    SAMPLE_MEETS[0],
    { ...SAMPLE_MEETS[1], joinedByUser: true },
  ];
  assert.equal(getNextBookedMeet(bookedList).id, 'meet-2');
});

test('getMeetCheckInMode returns host-qr only for meets created by the user and attendee-scanner for other meets', () => {
  const clientHostedMeet: MeetItem = { ...SAMPLE_MEETS[0], hostUid: '0001' };
  const otherHostMeet: MeetItem = { ...SAMPLE_MEETS[1], hostUid: '0042' };

  assert.equal(isMeetHostedByUser(clientHostedMeet, '0001'), true);
  assert.equal(getMeetCheckInMode(clientHostedMeet, '0001'), 'host-qr');

  assert.equal(isMeetHostedByUser(otherHostMeet, '0001'), false);
  assert.equal(getMeetCheckInMode(otherHostMeet, '0001'), 'attendee-scanner');
});

test('VIBE_PALETTES contains all 10 clean solid Light & Dark themes with zero gradients', () => {
  assert.equal(VIBE_PALETTES.length, 10);
  const ids = VIBE_PALETTES.map((p) => p.id);
  assert.deepEqual(ids, [
    'light-blue',
    'clean-white',
    'golden-yellow',
    'dark-pink',
    'purple',
    'dark-blue',
    'dark-gold',
    'dark-pink-neg',
    'dark-purple',
    'dark-emerald',
  ]);
  const lightBlue = getVibePaletteById('light-blue');
  assert.equal(lightBlue.name, 'Light Blue');
  assert.equal(lightBlue.isLightMode, true);
  const darkGold = getVibePaletteById('dark-gold');
  assert.equal(darkGold.name, 'Dark Negative · Golden');
  assert.equal(darkGold.isLightMode, false);
});

test('CATEGORY_TYPOGRAPHY_MAP defines 3 curated typographic variants (A, B, C) for all 10 categories', () => {
  const categories: MeetCategory[] = [
    'Playground',
    'Shopping',
    'Community',
    'Food',
    'Contest',
    'Tour',
    'Couple',
    'Study',
    'Party',
    'Tech',
  ];
  for (const cat of categories) {
    const info = CATEGORY_TYPOGRAPHY_MAP[cat];
    assert.ok(info, `Missing category typography for ${cat}`);
    assert.equal(info.variants.A.variant, 'A');
    assert.equal(info.variants.B.variant, 'B');
    assert.equal(info.variants.C.variant, 'C');
  }

  const playgroundB = resolveMeetTypography('Playground', 'meet-xyz', 'B');
  assert.equal(playgroundB.variant, 'B');
  assert.ok(playgroundB.fontFamily.includes('Bebas Neue'));

  assert.equal(getNextTypographyVariant('A'), 'B');
  assert.equal(getNextTypographyVariant('B'), 'C');
  assert.equal(getNextTypographyVariant('C'), 'A');
});

test('getEventCtaCopy returns event-specific, high-converting CTAs without Skin-in-Game jargon', () => {
  const communityFree = getEventCtaCopy(SAMPLE_MEETS[0]);
  assert.equal(communityFree.primaryCta, 'Count Me In · Free');

  const contestPaid = getEventCtaCopy(SAMPLE_MEETS[1]);
  assert.equal(contestPaid.primaryCta, 'Enter the Arena · ₹100');
  assert.equal(contestPaid.badgeLabel, '₹100 Refundable Entry Pass');

  const cricketTurf = getEventCtaCopy({
    ...SAMPLE_MEETS[1],
    category: 'Playground',
    title: 'Sunday Morning Cricket @ Nehru Stadium',
    escrowAmount: 100,
  });
  assert.equal(cricketTurf.primaryCta, 'Book Turf Spot · ₹100');
});

test('DEFAULT_RANDOM_PRESETS, formatPresetLabel, pickRandomMeetByPreset, and formatHostDateTimeLabel work as specified', () => {
  assert.equal(DEFAULT_RANDOM_PRESETS.length, 3);
  assert.equal(
    formatPresetLabel(DEFAULT_RANDOM_PRESETS[0]),
    'Within 5km - Free Meet - Sports Meet'
  );
  assert.equal(
    formatPresetLabel(DEFAULT_RANDOM_PRESETS[1]),
    'Within 10km - Free Meet - Food Meet'
  );
  assert.equal(
    formatPresetLabel(DEFAULT_RANDOM_PRESETS[2]),
    'Within 10km - Paid Meet - Shopping Meet'
  );

  const customPreset = {
    id: 'p-custom',
    distanceKm: 15,
    priceMode: 'paid' as const,
    category: 'Contest' as const,
  };
  assert.equal(
    formatPresetLabel(customPreset),
    'Within 15km - Paid Meet - Contest Meet'
  );

  const matched = pickRandomMeetByPreset(SAMPLE_MEETS, customPreset);
  assert.equal(matched?.id, 'meet-2');

  assert.equal(
    formatHostDateTimeLabel('2026-08-26', '18:30'),
    '6:30pm, 26th Aug'
  );
  assert.equal(
    formatHostDateTimeLabel('2026-09-01', '09:05'),
    '9:05am, 1st Sep'
  );
});

