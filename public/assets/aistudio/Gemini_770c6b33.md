Screen-by-Screen UI & Component Hierarchy

Mapped directly from your App Design.pdf doodles, heavily augmented for a "Billion-Dollar MVP" feel (incorporating micro-interactions, state transitions, and rich mock data).

A. Main Feed (Home) Screen

Route: /home

Layout Wrapper: MainScaffold (includes Bottom Nav or Sidebar)

States Required: Shimmer loading effect for grid, Empty state ("No meets nearby. Be the first to host!"), Error state ("Network disconnected").

Components:

TopAppHeader

ProfileAvatar (Links to Profile)

TickerTapeCarousel (Shows live events e.g., "Cricket Meet Nehru Stadium")

FilterIconButton (Opens Filter Overlay)

ViewToggleRow (Smooth animated toggle between List vs Map)

MeetGridList (Infinite scroll with rich mock data pre-populated)

MeetCard (Props: Title, Type, Distance, Time, Escrow Amount, Occupancy. Includes micro-interaction hover/tap states).

FloatingActionButton (Creates Meet, pulse animation)

SidebarDrawer (Contains: Profile, Filter, Available Meets, Upcoming, Create, Random, Sponsor Ads)

B. Map View Screen

Route: /home/map

States Required: Skeleton loader for map tiles, Location permission prompt modal.

Components:

GoogleMapControllerWidget

MeetMarker (Custom clustering for 10km radius, custom animated pins)

BottomSheetMeetDetails (Slides up smoothly when a marker is tapped)

JoinEscrowButton (Shows exact ₹ deposit required, loading spinner on tap)

C. Profile Screen

Route: /profile

Components:

ProfileHeaderInfo (Photo, Name "Jatin Kishore", UID, Rank badge)

StatsRow (Explored: 19 places, Found: 9 friends)

TrackRecordWidget (DataViz: Interactive charts for Created, Joined, Missed/Flaked)

WalletBalanceWidget (Shows accrued penalty credits from flaked users with a "withdraw/redeem" CTA)

NavigationList (Places, Friends, Map, Track)

LogoutButton

D. Filter Overlay

Route: ModalBottomSheet

Components:

DateTimePickers (After/Before - native bottom sheet pickers)

DistanceRadioGroup (5km, 10km, 20km, 25km+)

TypeMultiSelect (Pill-shaped toggle buttons: Playground, Shopping, Community, Food, etc.)

PriceToggle (Free/Paid)

DemographicsFilter (Age: Young/Mid/Senior, Gender: Both/Men/Women)

🚨 Missing Edge-Case Screens (Required by PRD)

Identity Verification Flow: /onboarding/kyc (Digilocker OAuth, Initial Camera Liveness).

Parental Consent Gate: /onboarding/guardian (Input for guardian SMS handshake).

Checkout / Escrow Screen: /meet/checkout (Razorpay UI for ₹100 deposit).

Active Event & QR Scanner: /meet/active (Host's rolling TOTP QR, Attendee's scanner).

Late-Night Dynamic Liveness: /meet/verify-pose (A fun, non-intrusive camera overlay: "Make your fav pose for the night!").

Active Tracking / SOS Overlay: Persistent system notification or UI showing active boundary monitoring.