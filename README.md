# Real Estate Market Dashboard

A Finviz-style real estate dashboard built with Next.js 14, featuring interactive heatmaps and detailed market analytics for US metro areas.

## Features

- **Interactive Heatmap**: Color-coded grid showing price changes across US metros
- **Drill-Down View**: Click any metro to explore its submarkets
- **Sortable Table**: Advanced filtering and sorting capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Easy-to-update JSON data structure

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: Tremor React
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd real-estate-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
real-estate-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── metro/[id]/page.tsx   # Metro detail page with submarkets
│   └── globals.css
├── components/
│   ├── MetroHeatmap.tsx      # Heatmap grid component
│   └── MetroTable.tsx        # Sortable table component
├── data/
│   ├── metros.json           # Metro market data
│   └── submarkets.json       # Submarket data
├── lib/
│   └── data.ts               # Data utilities and formatters
└── types/
    └── index.ts              # TypeScript type definitions
```

## Data Structure

The app uses JSON files for easy data management and future database migration:

### Metros (`data/metros.json`)
```typescript
{
  id: string;
  name: string;
  state: string;
  priceChange: number;
  medianPrice: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
}
```

### Submarkets (`data/submarkets.json`)
```typescript
{
  id: string;
  name: string;
  metroId: string;  // Links to metro
  priceChange: number;
  medianPrice: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
}
```

## Migrating to Supabase

The data structure is designed for easy Supabase migration:

1. Create two tables in Supabase:
   - `metros` table with columns matching the Metro interface
   - `submarkets` table with a foreign key to `metros(id)`

2. Update `lib/data.ts` to fetch from Supabase:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

export async function getMetros() {
  const { data } = await supabase.from('metros').select('*')
  return data
}
```

3. Convert pages to Server Components or use SWR for client-side fetching

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Visit [vercel.com](https://vercel.com) and import your repository

3. Vercel will automatically detect Next.js and configure the build settings

4. Click "Deploy" and your app will be live in minutes

### Environment Variables

Currently, no environment variables are required. When migrating to Supabase, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Update Market Data

Edit the JSON files in the `data/` directory:
- `metros.json` - Add or update metro markets
- `submarkets.json` - Add submarkets linked to metros via `metroId`

### Modify Color Scheme

Update the `getPriceChangeColor()` function in `lib/data.ts` to adjust heatmap colors:

```typescript
export function getPriceChangeColor(priceChange: number): string {
  // Customize thresholds and colors
  if (priceChange >= 10) return "bg-green-700";
  // ...
}
```

### Add New Metrics

1. Update TypeScript types in `types/index.ts`
2. Add new fields to JSON data
3. Update components to display new metrics

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tremor Documentation](https://tremor.so/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

MIT
