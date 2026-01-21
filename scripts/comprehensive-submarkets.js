const fs = require('fs');
const path = require('path');

// COMPREHENSIVE submarket mappings for all 24 metros
// Based on real neighborhoods, districts, and suburbs
const comprehensiveSubmarkets = {
  'nyc': [
    // Manhattan
    'Upper East Side', 'Upper West Side', 'Midtown', 'Chelsea', 'Greenwich Village',
    'SoHo', 'Tribeca', 'Lower East Side', 'East Village', 'West Village',
    'Financial District', 'Battery Park City', 'Hell\'s Kitchen', 'Murray Hill', 'Gramercy',
    'Harlem', 'Washington Heights', 'Inwood',
    // Brooklyn
    'Williamsburg', 'Greenpoint', 'Dumbo', 'Brooklyn Heights', 'Park Slope',
    'Prospect Heights', 'Fort Greene', 'Clinton Hill', 'Bed-Stuy', 'Bushwick',
    'Crown Heights', 'Sunset Park', 'Bay Ridge', 'Dyker Heights',
    // Queens
    'Astoria', 'Long Island City', 'Flushing', 'Forest Hills', 'Rego Park',
    'Jackson Heights', 'Sunnyside', 'Woodside',
    // Bronx
    'Riverdale', 'Pelham Bay', 'Fordham', 'Norwood',
    // Staten Island
    'St. George', 'Tottenville'
  ],
  'la': [
    // West LA
    'Santa Monica', 'Venice', 'Marina del Rey', 'Playa Vista', 'Westwood',
    'Brentwood', 'Pacific Palisades', 'Malibu', 'Beverly Hills', 'West Hollywood',
    'Culver City', 'Palms', 'Mar Vista',
    // Central LA
    'Downtown LA', 'Arts District', 'Little Tokyo', 'Koreatown', 'Mid-Wilshire',
    'Hollywood', 'Los Feliz', 'Silver Lake', 'Echo Park', 'Highland Park',
    'Eagle Rock',
    // South Bay
    'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach', 'Torrance', 'El Segundo',
    'Hawthorne', 'Inglewood',
    // San Fernando Valley
    'Studio City', 'Sherman Oaks', 'Encino', 'Tarzana', 'Woodland Hills',
    'Calabasas', 'Burbank', 'Glendale', 'Pasadena', 'South Pasadena',
    // East LA
    'Alhambra', 'Monterey Park', 'San Gabriel', 'Arcadia',
    // South LA
    'Long Beach', 'San Pedro'
  ],
  'chicago': [
    // North Side
    'Lincoln Park', 'Lakeview', 'Wrigleyville', 'Andersonville', 'Uptown',
    'Edgewater', 'Rogers Park', 'Ravenswood', 'North Center', 'Lincoln Square',
    // Northwest
    'Wicker Park', 'Bucktown', 'Logan Square', 'Avondale', 'Irving Park',
    'Portage Park', 'Jefferson Park',
    // Central
    'Loop', 'River North', 'Streeterville', 'Gold Coast', 'Old Town',
    'West Loop', 'Fulton Market', 'Ukrainian Village', 'Humboldt Park',
    // South Side
    'Hyde Park', 'Kenwood', 'Bronzeville', 'Bridgeport', 'Pilsen',
    'Chinatown', 'South Loop', 'Printer\'s Row',
    // Suburbs
    'Evanston', 'Oak Park', 'Naperville', 'Schaumburg', 'Arlington Heights',
    'Elmhurst', 'Wheaton', 'Downers Grove'
  ],
  'dallas': [
    // Central Dallas
    'Uptown', 'Downtown', 'Deep Ellum', 'Lower Greenville', 'Lakewood',
    'East Dallas', 'Knox-Henderson', 'M Streets', 'Greenville Avenue',
    // North Dallas
    'Preston Hollow', 'Park Cities', 'Highland Park', 'University Park',
    'North Park', 'Lake Highlands',
    // West/Northwest
    'Oak Lawn', 'Turtle Creek', 'Design District', 'Victory Park',
    // Suburbs - North
    'Plano', 'Frisco', 'McKinney', 'Allen', 'The Colony',
    'Carrollton', 'Addison', 'Richardson', 'Garland',
    // Suburbs - East
    'Mesquite', 'Rowlett', 'Rockwall',
    // Suburbs - South
    'Irving', 'Grand Prairie', 'Arlington', 'Mansfield', 'Cedar Hill',
    'DeSoto', 'Duncanville',
    // Suburbs - West
    'Fort Worth', 'Southlake', 'Grapevine', 'Coppell', 'Flower Mound',
    'Lewisville', 'Denton'
  ],
  'houston': [
    // Inner Loop
    'Downtown', 'Midtown', 'Montrose', 'River Oaks', 'Heights',
    'West University', 'Rice Village', 'Museum District', 'Medical Center',
    'EaDo', 'Third Ward', 'Fourth Ward',
    // Inner West
    'Galleria', 'Uptown', 'Tanglewood', 'Memorial', 'Spring Branch',
    'Bellaire', 'Meyerland',
    // North/Northwest
    'The Woodlands', 'Spring', 'Tomball', 'Cy-Fair', 'Cypress',
    'Willowbrook', 'Greenspoint',
    // West/Southwest
    'Katy', 'Sugar Land', 'Missouri City', 'Stafford', 'Richmond',
    'Cinco Ranch', 'Aliana',
    // South/Southeast
    'Pearland', 'Friendswood', 'League City', 'Clear Lake', 'Pasadena',
    'Baytown',
    // East
    'Humble', 'Kingwood', 'Atascocita'
  ],
  'phoenix': [
    // Central Phoenix
    'Downtown Phoenix', 'Midtown', 'Arcadia', 'Biltmore', 'Encanto',
    'Uptown', 'Central Corridor',
    // North Phoenix
    'North Phoenix', 'Desert Ridge', 'Deer Valley', 'Paradise Valley',
    'Cave Creek', 'Anthem', 'New River',
    // East Valley
    'Scottsdale', 'Old Town Scottsdale', 'North Scottsdale', 'South Scottsdale',
    'Tempe', 'Mesa', 'Gilbert', 'Chandler', 'Queen Creek',
    'Apache Junction', 'Gold Canyon',
    // West Valley
    'Glendale', 'Peoria', 'Surprise', 'Avondale', 'Goodyear',
    'Buckeye', 'Litchfield Park', 'Tolleson',
    // South Phoenix
    'Ahwatukee', 'Laveen', 'South Mountain'
  ],
  'philadelphia': [
    // Center City
    'Center City', 'Rittenhouse Square', 'Washington Square West', 'Old City',
    'Society Hill', 'Graduate Hospital', 'Avenue of the Arts',
    // North Philadelphia
    'Fishtown', 'Northern Liberties', 'Kensington', 'Port Richmond',
    'Fairmount', 'Brewerytown', 'Strawberry Mansion',
    // West Philadelphia
    'University City', 'Spruce Hill', 'Powelton Village', 'Cedar Park',
    'Walnut Hill', 'Overbrook',
    // South Philadelphia
    'South Philly', 'Passyunk Square', 'Queen Village', 'Bella Vista',
    'Point Breeze', 'East Passyunk', 'Gray\'s Ferry',
    // Northwest
    'Chestnut Hill', 'Mount Airy', 'Germantown', 'Manayunk', 'Roxborough',
    // Northeast
    'Northeast Philadelphia', 'Bustleton', 'Mayfair',
    // Suburbs
    'Main Line', 'Ardmore', 'Bryn Mawr', 'Haverford', 'Radnor',
    'Wayne', 'Conshohocken', 'King of Prussia'
  ],
  'san-antonio': [
    // Central
    'Downtown', 'Riverwalk', 'King William', 'Southtown', 'Lavaca',
    'Monte Vista', 'Beacon Hill', 'Mahncke Park',
    // North Central
    'Alamo Heights', 'Terrell Hills', 'Olmos Park', 'Lincoln Heights',
    // North
    'Stone Oak', 'Sonterra', 'The Dominion', 'Canyon Springs', 'Rogers Ranch',
    'Bulverde', 'Spring Branch',
    // Northwest
    'Medical Center', 'Northwest Crossing', 'Helotes', 'Leon Valley',
    'Shavano Park',
    // Northeast
    'Windcrest', 'Kirby', 'Converse', 'Live Oak', 'Schertz',
    'Cibolo', 'New Braunfels',
    // East
    'Fort Sam Houston', 'Dignowity Hill',
    // South
    'Southside', 'Brooks City Base',
    // West
    'Westside', 'Lackland AFB', 'Sea World Area'
  ],
  'san-diego': [
    // Coastal
    'La Jolla', 'Pacific Beach', 'Mission Beach', 'Ocean Beach', 'Point Loma',
    'Coronado', 'Imperial Beach', 'Del Mar', 'Solana Beach', 'Encinitas',
    'Carlsbad', 'Oceanside',
    // Central
    'Downtown', 'Gaslamp Quarter', 'Little Italy', 'Bankers Hill', 'Hillcrest',
    'North Park', 'South Park', 'Normal Heights', 'University Heights',
    'Kensington', 'Balboa Park',
    // East County
    'La Mesa', 'El Cajon', 'Santee', 'Lakeside', 'Alpine',
    'Rancho San Diego',
    // North County Inland
    'Escondido', 'San Marcos', 'Vista', 'Poway', 'Rancho Bernardo',
    'Scripps Ranch', 'Mira Mesa', 'Rancho Peñasquitos',
    // South Bay
    'Chula Vista', 'National City', 'Bonita', 'Eastlake', 'Otay Ranch'
  ],
  'austin': [
    // Central
    'Downtown', 'Rainey Street', 'Warehouse District', 'West Campus',
    'Hyde Park', 'Clarksville', 'Bouldin Creek', 'Travis Heights',
    'Zilker', 'Barton Hills',
    // East Austin
    'East Austin', 'East Cesar Chavez', 'Holly', 'Govalle', 'Windsor Park',
    'Mueller', 'Cherrywood',
    // South
    'South Congress', 'South Lamar', 'St. Edwards', 'Circle C',
    'Westgate', 'Manchaca',
    // North
    'North Loop', 'Crestview', 'Allandale', 'Brentwood', 'Rosedale',
    // Northwest
    'The Domain', 'Arboretum', 'Great Hills', 'Jollyville', 'Anderson Mill',
    // West
    'Westlake Hills', 'Tarrytown', 'Rollingwood', 'Bee Cave',
    // Suburbs
    'Round Rock', 'Cedar Park', 'Leander', 'Georgetown', 'Pflugerville',
    'Kyle', 'Buda', 'Dripping Springs', 'Lakeway'
  ],
  'san-jose': [
    // Central San Jose
    'Downtown San Jose', 'Japantown', 'Willow Glen', 'Rose Garden',
    'Naglee Park', 'Shasta Hanchett', 'Alameda',
    // West San Jose
    'West San Jose', 'Cambrian', 'Almaden Valley', 'Blossom Valley',
    'Silver Creek',
    // North San Jose
    'North San Jose', 'Berryessa', 'Alviso', 'Milpitas',
    // East San Jose
    'East San Jose', 'Evergreen', 'Alum Rock',
    // South Bay Cities
    'Saratoga', 'Los Gatos', 'Campbell', 'Cupertino', 'Sunnyvale',
    'Santa Clara', 'Mountain View', 'Palo Alto', 'Los Altos',
    'Monte Sereno', 'Morgan Hill', 'Gilroy'
  ],
  'jacksonville': [
    // Urban Core
    'Downtown Jacksonville', 'Riverside', 'Avondale', 'San Marco', 'Springfield',
    'Brooklyn', 'Five Points', 'Murray Hill',
    // Beaches
    'Jacksonville Beach', 'Atlantic Beach', 'Neptune Beach', 'Ponte Vedra Beach',
    // Southside
    'Southside', 'Baymeadows', 'Deerwood', 'Town Center', 'Mandarin',
    'Julington Creek', 'Fruit Cove',
    // Westside
    'Westside', 'Ortega', 'Argyle', 'Cedar Hills',
    // Northside
    'Northside', 'Oceanway',
    // Arlington
    'Arlington', 'Regency', 'Intracoastal West',
    // Suburbs
    'Orange Park', 'Fleming Island', 'Middleburg', 'St. Augustine'
  ],
  'columbus': [
    // Downtown & Central
    'Downtown Columbus', 'Arena District', 'Short North', 'Victorian Village',
    'Italian Village', 'German Village', 'Brewery District', 'Harrison West',
    'Olde Towne East', 'Schumacher Place',
    // North
    'Clintonville', 'Beechwold', 'North Columbus', 'Worthington', 'Powell',
    'Dublin', 'Lewis Center', 'Delaware',
    // Northwest
    'Upper Arlington', 'Grandview Heights', 'Marble Cliff',
    // Northeast
    'Westerville', 'New Albany', 'Gahanna', 'Easton',
    // East
    'Bexley', 'Whitehall', 'Reynoldsburg', 'Pickerington',
    // South
    'German Village', 'Merion Village', 'Brewery District', 'Circleville',
    // Southwest
    'Hilliard', 'Grove City', 'Galloway'
  ],
  'charlotte': [
    // Uptown & Central
    'Uptown Charlotte', 'Fourth Ward', 'First Ward', 'Second Ward',
    'Third Ward', 'South End', 'Dilworth', 'Myers Park', 'Elizabeth',
    'Plaza Midwood', 'NoDa', 'Villa Heights',
    // South Charlotte
    'South Charlotte', 'Ballantyne', 'Blakeney', 'Stonecrest', 'Providence',
    'Pineville', 'Fort Mill',
    // North Charlotte
    'North Charlotte', 'University City', 'University', 'Hidden Valley',
    'Cornelius', 'Huntersville', 'Davidson',
    // East Charlotte
    'East Charlotte', 'Matthews', 'Mint Hill', 'Stallings',
    // West Charlotte
    'West Charlotte', 'Freedom Park', 'Belmont', 'Mount Holly',
    // Lake Norman Area
    'Lake Norman', 'Mooresville'
  ],
  'seattle': [
    // Central & Downtown
    'Downtown Seattle', 'Belltown', 'Pioneer Square', 'First Hill',
    'Capitol Hill', 'Queen Anne', 'South Lake Union', 'Lower Queen Anne',
    'Denny Triangle',
    // East & Northeast
    'University District', 'Montlake', 'Ravenna', 'Maple Leaf',
    'Northgate', 'Lake City', 'Wedgwood', 'View Ridge', 'Laurelhurst',
    // West & Northwest
    'West Seattle', 'Alki', 'Ballard', 'Fremont', 'Greenwood',
    'Phinney Ridge', 'Wallingford', 'Green Lake',
    // South Seattle
    'Columbia City', 'Beacon Hill', 'Georgetown', 'SODO', 'Rainier Valley',
    'Seward Park', 'Rainier Beach',
    // Eastside (King County)
    'Bellevue', 'Redmond', 'Kirkland', 'Issaquah', 'Sammamish',
    'Bothell', 'Woodinville', 'Mercer Island', 'Renton', 'Newcastle',
    // North Suburbs
    'Shoreline', 'Lynnwood', 'Edmonds', 'Mountlake Terrace', 'Mukilteo',
    // South King County
    'Kent', 'Auburn', 'Federal Way', 'Tukwila', 'SeaTac', 'Des Moines',
    // South Sound
    'Puyallup', 'Sumner', 'Tacoma', 'Gig Harbor'
  ],
  'denver': [
    // Central Denver
    'Downtown Denver', 'LoDo', 'Union Station', 'Five Points', 'RiNo',
    'Cole', 'Curtis Park', 'Whittier', 'City Park', 'Congress Park',
    // Central West
    'Cherry Creek', 'Glendale', 'Virginia Village', 'Hilltop',
    // Northwest
    'Highlands', 'Highland', 'LoHi', 'Sloan Lake', 'Berkeley', 'Sunnyside',
    'Regis', 'Chaffee Park',
    // Southwest
    'Washington Park', 'Platt Park', 'University', 'Wellshire', 'Bear Valley',
    'Hampden', 'Athmar Park',
    // North
    'Stapleton', 'Northfield', 'Montbello', 'Green Valley Ranch',
    // South
    'University Hills', 'Southmoor Park',
    // Suburbs - South
    'Littleton', 'Englewood', 'Greenwood Village', 'Cherry Hills Village',
    'Centennial', 'Lone Tree', 'Castle Rock', 'Highlands Ranch',
    // Suburbs - West
    'Lakewood', 'Golden', 'Wheat Ridge', 'Arvada', 'Westminster',
    // Suburbs - North
    'Thornton', 'Northglenn', 'Brighton', 'Commerce City',
    // Suburbs - East
    'Aurora', 'Parker'
  ],
  'boston': [
    // Central Boston
    'Back Bay', 'Beacon Hill', 'Bay Village', 'Downtown Crossing',
    'Financial District', 'Chinatown', 'Leather District', 'West End',
    'North End',
    // South & Southwest
    'South End', 'South Boston', 'Seaport', 'Fort Point', 'Dorchester',
    'Roxbury', 'Jamaica Plain', 'Roslindale', 'West Roxbury', 'Hyde Park',
    'Mattapan',
    // North
    'Charlestown', 'East Boston',
    // West
    'Fenway', 'Kenmore', 'Allston', 'Brighton',
    // Cambridge
    'Cambridge', 'Harvard Square', 'Central Square', 'Kendall Square',
    'East Cambridge', 'North Cambridge', 'Porter Square',
    // Inner Suburbs
    'Somerville', 'Brookline', 'Newton', 'Watertown', 'Belmont', 'Arlington',
    'Medford', 'Malden', 'Everett', 'Chelsea', 'Revere', 'Winthrop',
    // North Shore
    'Salem', 'Lynn', 'Marblehead', 'Swampscott',
    // South Suburbs
    'Quincy', 'Milton', 'Dedham', 'Needham', 'Wellesley', 'Waltham'
  ],
  'nashville': [
    // Central Nashville
    'Downtown Nashville', 'The Gulch', 'SoBro', 'Music Row', 'Midtown',
    'West End', 'Vanderbilt', 'Germantown', 'Salemtown', 'Buena Vista',
    // East Nashville
    'East Nashville', '5 Points', 'Inglewood', 'Lockeland Springs',
    'McFerrin Park', 'Shelby Hills',
    // South Nashville
    '12 South', 'Melrose', 'Berry Hill', 'Woodbine', 'Glencliff',
    // West Nashville
    'The Nations', 'Sylvan Park', 'Charlotte Park', 'Richland', 'West Meade',
    'Bellevue',
    // North Nashville
    'North Nashville', 'Bordeaux', 'Whites Creek',
    // Green Hills & South
    'Green Hills', 'Forest Hills', 'Oak Hill', 'Crieve Hall',
    // East Suburbs
    'Donelson', 'Hermitage', 'Mt. Juliet', 'Lebanon',
    // South Suburbs
    'Brentwood', 'Franklin', 'Spring Hill', 'Nolensville',
    // West/North Suburbs
    'Hendersonville', 'Goodlettsville', 'White House', 'Gallatin'
  ],
  'atlanta': [
    // Central Atlanta
    'Downtown Atlanta', 'Midtown', 'Buckhead', 'Peachtree Hills',
    'Ansley Park', 'Morningside', 'Virginia Highland', 'Poncey-Highland',
    // East Atlanta
    'Old Fourth Ward', 'Inman Park', 'Cabbagetown', 'Reynoldstown',
    'East Atlanta Village', 'Edgewood', 'Kirkwood', 'East Lake',
    'Decatur', 'Avondale Estates',
    // West Atlanta
    'West Midtown', 'Home Park', 'Westview', 'Grove Park', 'Vine City',
    // South Atlanta
    'Summerhill', 'Grant Park', 'Ormewood Park', 'Chosewood Park',
    'Pittsburgh', 'Mechanicsville',
    // North Atlanta & Suburbs
    'Brookhaven', 'Sandy Springs', 'Dunwoody', 'Roswell', 'Alpharetta',
    'Johns Creek', 'Milton', 'Marietta', 'Smyrna', 'Vinings',
    // Northeast Suburbs
    'Chamblee', 'Doraville', 'Norcross', 'Duluth', 'Suwanee',
    'Lawrenceville', 'Buford',
    // South Suburbs
    'College Park', 'East Point', 'Hapeville', 'Forest Park', 'Jonesboro',
    'Fayetteville', 'Peachtree City',
    // West Suburbs
    'Kennesaw', 'Acworth', 'Powder Springs'
  ],
  'miami': [
    // Miami Beach
    'South Beach', 'Mid Beach', 'North Beach', 'Surfside', 'Bal Harbour',
    // Central Miami
    'Downtown Miami', 'Brickell', 'Edgewater', 'Wynwood', 'Midtown',
    'Design District', 'Buena Vista', 'Little Havana', 'Little Haiti',
    // North Miami
    'North Miami', 'North Miami Beach', 'Aventura', 'Sunny Isles Beach',
    'Golden Beach', 'Hallandale Beach',
    // West Miami
    'Coral Gables', 'South Miami', 'Coconut Grove', 'Pinecrest',
    'Kendall', 'Dadeland', 'West Kendall', 'The Hammocks', 'Doral',
    'Sweetwater', 'Fontainebleau', 'Westchester',
    // South Miami-Dade
    'Cutler Bay', 'Palmetto Bay', 'Homestead', 'Florida City',
    // West Miami-Dade
    'Hialeah', 'Miami Lakes', 'Miami Gardens', 'Opa-locka',
    // Keys Access
    'Key Biscayne'
  ],
  'tampa': [
    // Central Tampa
    'Downtown Tampa', 'Channelside', 'Ybor City', 'Tampa Heights',
    'Seminole Heights', 'Riverside Heights', 'VM Ybor',
    // South Tampa
    'South Tampa', 'Hyde Park', 'Palma Ceia', 'Bayshore Beautiful',
    'Beach Park', 'Virginia Park',
    // West Tampa
    'West Tampa', 'Town \'N\' Country', 'Westchase', 'Citrus Park',
    'Carrollwood', 'Northdale',
    // North Tampa
    'New Tampa', 'University', 'Pebble Creek', 'Wesley Chapel',
    'Lutz', 'Land O\' Lakes',
    // East Tampa
    'East Tampa',
    // Beaches
    'Clearwater Beach', 'Clearwater', 'Dunedin', 'Safety Harbor',
    'St. Pete Beach', 'Treasure Island', 'Madeira Beach',
    // St. Petersburg
    'Downtown St. Pete', 'Historic Kenwood', 'Old Northeast', 'Crescent Lake',
    'Gulfport', 'South Pasadena', 'Pinellas Park',
    // South County
    'Brandon', 'Riverview', 'Valrico', 'FishHawk Ranch',
    'Apollo Beach', 'Ruskin', 'Sun City Center',
    // North County
    'Temple Terrace', 'Thonotosassa'
  ],
  'orlando': [
    // Central Orlando
    'Downtown Orlando', 'Thornton Park', 'Lake Eola Heights', 'College Park',
    'Delaney Park', 'Baldwin Park', 'Audubon Park',
    // Winter Park
    'Winter Park', 'Maitland', 'Eatonville',
    // North Orlando
    'Altamonte Springs', 'Longwood', 'Lake Mary', 'Sanford', 'Heathrow',
    'Apopka', 'Wekiwa Springs',
    // East Orlando
    'East Orlando', 'Avalon Park', 'Waterford Lakes', 'Alafaya',
    'University', 'Oviedo', 'Chuluota',
    // South Orlando
    'South Orlando', 'Lake Nona', 'Medical City', 'Meadow Woods',
    'Southchase', 'Kissimmee', 'Celebration', 'St. Cloud',
    // West Orlando
    'Dr. Phillips', 'Windermere', 'MetroWest', 'Gotha', 'Winter Garden',
    'Ocoee', 'Clarcona', 'Pine Hills',
    // Southwest Orlando
    'Sand Lake', 'Bay Hill', 'Belle Isle', 'Edgewood',
    // Theme Park Area
    'Davenport', 'Championsgate', 'Four Corners'
  ],
  'raleigh': [
    // Central Raleigh
    'Downtown Raleigh', 'Glenwood South', 'Warehouse District', 'Moore Square',
    'Boylan Heights', 'Oakwood', 'Mordecai',
    // North Raleigh
    'North Raleigh', 'North Hills', 'Midtown', 'Brier Creek', 'Falls of Neuse',
    'Bedford', 'Wakefield',
    // West Raleigh
    'West Raleigh', 'Hillsborough Street', 'NCSU Campus', 'Lake Johnson',
    // South Raleigh
    'South Raleigh', 'South Park', 'Garner', 'Cleveland',
    // East Raleigh
    'East Raleigh', 'Knightdale', 'Wendell', 'Zebulon',
    // Cary
    'Cary', 'West Cary', 'Apex', 'Morrisville', 'Holly Springs',
    // Durham (Triangle)
    'Durham', 'Chapel Hill', 'Carrboro',
    // Wake Forest
    'Wake Forest', 'Rolesville', 'Youngsville'
  ],
  'las-vegas': [
    // The Strip & Central
    'The Strip', 'Downtown Las Vegas', 'Arts District', 'Fremont East',
    'Paradise', 'Winchester',
    // Henderson
    'Henderson', 'Green Valley', 'Green Valley Ranch', 'MacDonald Ranch',
    'Anthem', 'Seven Hills', 'Inspirada', 'Cadence',
    // Summerlin
    'Summerlin', 'The Cliffs', 'Red Rock', 'The Ridges', 'The Hills',
    'Queensridge', 'The Crossing',
    // North Las Vegas
    'North Las Vegas', 'Aliante', 'Eldorado', 'Craig Ranch',
    // Southwest
    'Southwest Las Vegas', 'Mountains Edge', 'Southern Highlands',
    'Rhodes Ranch', 'The Lakes',
    // Northwest
    'Northwest Las Vegas', 'Centennial Hills', 'Skye Canyon', 'Providence',
    // East Las Vegas
    'East Las Vegas', 'Sunrise Manor', 'Whitney',
    // Boulder City
    'Boulder City', 'Lake Las Vegas'
  ]
};

module.exports = comprehensiveSubmarkets;
