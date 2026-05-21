# AeroRoute

A browser-openable prototype for an advanced cycling platform with smart route controls, MapLibre overlays, weather context, and GPX activity importing.

Open `index.html` in a browser to run it. The map uses public CDN assets and Carto basemap tiles, so the map layer needs internet access. The routing, overlays, controls, and GPX parser run locally in the browser with demo data.

Node and npm are not required for this static prototype. For the Next.js version described in the original blueprint, install Node.js LTS with:

```powershell
winget install OpenJS.NodeJS.LTS
```

After installing, restart VS Code or your terminal and confirm with:

```powershell
node --version
npm --version
```

## What is built

- Interactive MapLibre dashboard with route line, infrastructure overlays, slope overlays, wind animation, weather strip, and route metrics.
- Smart routing controls for surface preference, climbing appetite, gravel priority, wind avoidance, bike-lane preference, and scenic detours.
- Activity hub with recent ride cards and canvas route thumbnails.
- GPX/XML drop-zone that parses `<trkpt>` coordinates, elevation gain, distance, and duration directly in the browser.

## Collected project choices

Use this section as the current project brief. Do not paste private API keys into public GitHub repos. Public browser map tokens can be used in frontend code later, but they should still be restricted to allowed domains.

```text
Launch area: York Region and Toronto
Ride types: All types
Important roads/trails/neighborhoods: TBD
Map provider: MapTiler
Map style URL: TBD
Public map token: Created in MapTiler; do not commit here
Weather provider: TBD
Routing engine: TBD
OSM extract URL: TBD
Elevation provider: TBD
Database provider: TBD
User accounts needed: TBD
Sample GPX files ready: TBD
Logo/brand ready: TBD
Preferred first milestone: TBD
```

## Step-by-step collection checklist

### Step 1: Pick the launch area

Status: done.

Collected:

```text
Launch area: York Region and Toronto
Ride types: All types
Important roads/trails/neighborhoods: TBD
```

Optional later detail:

- List important cycling corridors, trails, or neighborhoods.
- Examples: Don Valley trails, Waterfront Trail, Finch Hydro Corridor, Richmond Hill, Markham, Vaughan, Scarborough.

### Step 2: Choose a map provider

Status: in progress.

You created a MapTiler API key. Since the key appeared in a screenshot, do one of these before using it in a public app:

- Preferred: restrict the key to allowed HTTP origins.
- Extra safe: click `REPLACE` in MapTiler and create a fresh key, then restrict the new key.

In MapTiler, collect:

1. Go to `API Keys`.
2. Open or edit the key.
3. MapTiler expects bare domains in `Allowed HTTP Origins`, not full URLs with `http://`, `https://`, or ports.
4. For local testing, leave `Allowed HTTP Origins` empty for now. This lets the key work while the app is opened from `index.html` or a local dev server.
5. When you have a real domain, create or update a production key and add only the domain name, for example:

```text
your-domain.com
*.your-domain.com
```

6. If MapTiler rejects local development because the request has no `Origin` or `Referer`, use this placeholder only for a temporary development key:

```text
?
```

7. Because a key appeared in a screenshot, replace this key before production.
8. Go to `Maps`.
9. Pick a style. Recommended for this cycling app:

```text
Outdoor
```

10. Copy the MapLibre/GL style URL. It will look similar to:

```text
https://api.maptiler.com/maps/outdoor-v2/style.json?key=YOUR_MAPTILER_KEY
```

What to send me next:

```text
Map provider: MapTiler
Style URL:
Public map token is restricted: yes/no
```

Do not send the key if you are uncomfortable sharing it. You can say `key ready`, and I will show you where to paste it locally.

### Step 3: Create a weather API account

Weather powers temperature, precipitation, wind speed, and wind direction.

Recommended easiest option:

- OpenWeatherMap.

Collect:

- Weather provider name.
- API key.
- Units: metric or imperial.

What to send me:

```text
Weather provider:
Units:
API key is ready: yes/no
```

### Step 4: Choose routing data

Routing needs OpenStreetMap data for York Region and Toronto. The recommended routing engine is Valhalla.

Recommended path:

1. Install Docker Desktop.
2. Download an OpenStreetMap extract for Ontario or a custom Toronto/York Region area.
3. Start with one region before expanding.

Useful sources:

- Geofabrik downloads: `https://download.geofabrik.de/`
- BBBike extracts: `https://extract.bbbike.org/`
- Valhalla project: `https://github.com/valhalla/valhalla`

Collect:

```text
Routing engine:
OSM extract URL:
Docker installed:
```

### Step 5: Choose elevation data

Elevation is needed for climbing, slope coloring, and route gain calculations.

Simplest options:

- OpenTopoData API for early development.
- MapTiler terrain/elevation services if available in your plan.
- Local DEM files later for production-quality routing.

Collect:

```text
Elevation provider:
API key needed:
Coverage checked:
```

### Step 6: Decide where activities will be saved

The prototype parses GPX files in the browser, but a real app needs storage.

Recommended options:

- Supabase Postgres: easiest hosted PostgreSQL/PostGIS path.
- Local PostgreSQL/PostGIS in Docker: good for development.
- Neon or Railway Postgres: also fine, but confirm PostGIS support.

Collect:

```text
Database provider:
PostGIS supported:
User accounts needed:
```

### Step 7: Gather sample activity files

Sample rides help test upload, maps, distance, elevation gain, and stats.

Collect:

- 2 or 3 GPX files from Garmin, Wahoo, Strava, Apple Watch, or another tracker.
- Optional FIT files if you want FIT support later.
- A note about which file should represent road, gravel, and climbing.

What to send me:

```text
Sample GPX files ready:
Need FIT support:
Ride examples:
```

### Step 8: Collect brand and content

Collect:

- Logo file, preferably SVG or PNG.
- Brand colors, or 2 to 4 websites/apps whose style you like.
- Short tagline.
- Any exact wording you want on the site.
- Contact/support email if this will become public.

What to send me:

```text
Logo ready:
Brand colors:
Tagline:
Style references:
Contact email:
```

### Step 9: Decide the first real build target

Recommended milestone:

```text
MVP: Next.js app with real MapTiler map, weather endpoint, GPX upload, and demo routing.
```

More advanced milestone:

```text
Routing MVP: Next.js app plus Valhalla backend using real OSM data and custom route preferences.
```

### Step 10: Send this filled-out summary

When you have the basics, send me this:

```text
Launch area:
Ride types:
Map provider:
Map style URL:
Weather provider:
Routing engine:
OSM extract URL:
Elevation provider:
Database provider:
User accounts needed:
Sample GPX files ready:
Logo/brand ready:
Preferred first milestone:
```

## Original blueprint

Using GitHub Copilot in VS Code is a fantastic way to build this. Copilot excels at generating boilerplate code, setting up API connections, and writing complex routing logic when given clear, structured architectural prompts.

Here is your comprehensive development blueprint. You can copy sections of this document directly into VS Code or a `README.md` file to feed to Copilot as context.

---

# 🚴 Project Blueprint: AeroRoute (Cycling Platform)

## 1. Project Overview & Goals

The goal of this project is to build an advanced, context-aware cycling platform that goes beyond standard navigation. Unlike traditional platforms, this website dynamically calculates the optimal cycling route by combining road infrastructure with real-time environmental factors.

### Core Objectives

* **Dynamic Custom Routing:** Build a multi-criteria routing engine that adjusts paths based on active user preferences (e.g., surface types, minimizing headwinds, avoiding or maximizing climbs).
* **Rich Map Overlays:** Provide a clear, visual map dashboard highlighting cycling infrastructure (bike lanes vs. gravel vs. pavement), topology (slopes), and live weather.
* **Activity Dashboard:** Establish a social and analytical feed (similar to Strava) where users can import, analyze, and save their rides.

---

## 2. Platform Features Description

### A. The Interactive Map & Dashboard

* **Infrastructure Layers:** Visually distinct color-coding for pavement, gravel/dirt roads, and dedicated bike lanes.
* **Elevation Mapping:** Color-coded slope steepness (e.g., green for flat, yellow for moderate, red for gradients greater than 8%).
* **Live Environmental Data:** A persistent overlay showing temperature, precipitation chance, and an animated vector layer indicating wind speed and direction.

### B. Smart Routing Engine (The Core Innovation)

Users interact with a control panel to set sliders or toggles for their ride preferences. The app processes these filters into a customized path:

| User Preference | Technical Real-Time Action |
| --- | --- |
| **Avoid Headwinds** | App cross-references ride direction with weather API wind vectors; penalizes road segments pointing directly into the wind. |
| **Surface Choice** | Drastically alters road "weights" based on OpenStreetMap (OSM) tags (`surface=asphalt` vs `surface=gravel`). |
| **Climbing Toggle** | Switches costing models between flat valley paths or heavy elevation gain using Digital Elevation Models (DEM). |

### C. Activity Hub

* **Feed:** A scrollable list of recent rides showing distance, time, elevation gain, and an interactive thumbnail map.
* **GPX/FIT File Upload:** A drop-zone for files exported from Garmin, Wahoo, or Apple Watches, parsing the spatial coordinates into a relational database.

---

## 3. Technology Stack & Tools

To ensure Copilot gives you the cleanest code, you'll want to use modern, well-documented frameworks.

### Frontend (The UI & Visuals)

* **Framework:** **React** with **Next.js** (App Router, TypeScript). Next.js provides excellent server-side rendering for faster initial map load speeds.
* **Styling:** **Tailwind CSS** (Copilot handles Tailwind classes perfectly).
* **Map Rendering:** **Maplibre GL JS** or **Mapbox GL JS**. Maplibre is a highly performant, open-source fork of Mapbox that handles custom vector tiles seamlessly.

### Backend & Data Processing

* **API Layer:** **Python (FastAPI)** or **Node.js (TypeScript)**.
> *Tip:* If you plan to do heavy mathematical operations matching wind directions to route segments, Python with `geopandas` and `shapely` is highly efficient.


* **Database:** **PostgreSQL** with the **PostGIS** extension (vital for geographic queries, bounding boxes, and route coordinate lines).

### Mapping & Environmental Engines

* **Routing Core:** **Valhalla** or **BRouter** (deployed via Docker). These allow you to send custom JSON configurations to adjust surface and hill penalties per request.
* **Map Data:** **OpenStreetMap (OSM)** extracted via Overpass API or Geofabrik.
* **Weather Data:** **Tomorrow.io API** or **OpenWeatherMap API** (both offer comprehensive wind vectors and localized weather).

---

## 4. Phase-by-Phase Execution Plan

Use this timeline to tackle the project in bite-sized pieces. You can prompt Copilot by telling it: *"We are currently in Phase 1, Step 2. Help me build..."*

```
[Phase 1: Foundations] ──> [Phase 2: Live Overlays] ──> [Phase 3: The Router] ──> [Phase 4: Activities]
  - DB & Basic Layout         - Weather & Surface         - Valhalla Integration   - GPX Processing
  - Base Map Setup            - Wind Vectors Layer        - Custom Preference API  - Social Feed UI

```

### Phase 1: Foundation & Base Mapping

* **Step 1:** Initialize the Next.js app, configure Tailwind, and set up your PostgreSQL/PostGIS database instance (use Docker for ease).
* **Step 2:** Integrate Maplibre/Mapbox GL into the main dashboard page. Load a beautiful base map style (like a dark mode map, which makes colored paths pop).

### Phase 2: Live Weather & Surface Overlays

* **Step 1:** Write the backend service to fetch local weather data and expose it via your own API endpoint.
* **Step 2:** Configure the map layers to filter OpenStreetMap features so that `cycleway` tags display as bright neon lines and `gravel` displays as a distinct pattern.

### Phase 3: The Custom Routing Engine (The MVP Milestone)

* **Step 1:** Set up your routing engine container (Valhalla).
* **Step 2:** Build the frontend sidebar panel containing route preference sliders (Climbing, Gravel, Wind).
* **Step 3:** Write the backend algorithm that takes those slider percentages, queries the weather API for current wind headings, generates a custom costing model profile, and sends it to your router.

### Phase 4: Activity Feed & GPX Processing

* **Step 1:** Build the GPX file uploader on the frontend.
* **Step 2:** Write the backend parsing function to turn XML data (`<trkpt lat="..." lon="...">`) into PostGIS geometries.
* **Step 3:** Design the feed UI to display past activities with calculated stats (total distance, average speed).

---

## 💡 Pro-Tips for Using Copilot on This Project

1. **Context is King:** Keep your database schema file (`schema.sql` or Prisma file) and your TypeScript type definitions open in your VS Code tabs. Copilot reads open tabs to ensure the API endpoints it generates perfectly match your data models.
2. **Prompt for Valhalla Costing:** When you get to the routing logic, give Copilot explicit parameters. For example:
> *"Write a Python FastAPI endpoint that takes a user's route request, calculates the bearing between coordinates, compares it against an active wind vector, and formats a Valhalla `costing_options` JSON object with penalized weights."*
