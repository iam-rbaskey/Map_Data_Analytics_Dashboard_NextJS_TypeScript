# An Interactive GIS Data Visualization Tool

This is a sophisticated, web-based dashboard designed for **visualizing time-series geospatial data**. It enables users to draw custom polygonal regions on an interactive map, connect them to real-world weather data via the Open-Meteo API, and define dynamic color rules that change over time and space.

Built with modern frontend architecture and smart data-handling mechanisms, it offers a **highly responsive**, **component-driven**, and **AI-enhanced** user experience.

---

## Features

### Interactive Map
- Rendered using **Mapbox GL JS**
- Fixed zoom level for consistent 2 sq. km area
- Supports polygon drawing (3–12 vertices)

### Timeline Slider
- Explore data across a **30-day window**
- Time unit selection: **Hour**, **Day**, **Week**
- Dual-mode: **single-point** or **range-based**
- Includes playback controls (⏪ ⏯️ ⏩)

### Polygon Drawing & Management
- Draw & edit polygons directly on the map
- Manage polygons via a sidebar (edit/delete)
- Persist data using `localStorage`

### Rule-Based Styling
- Define rules like `temperature > 25 → Red`
- Real-time color updates based on rules and weather data
- Supports multiple data sources (temperature, humidity, etc.)

### API & AI Integration
- Historical data fetched from **Open-Meteo API**
- Uses **@turf/turf** to get polygon centroid for precise queries
- Optional: **Genkit + Google Gemini AI** filters unnecessary re-renders

### Modern UI/UX
- Built with **Next.js + Tailwind CSS + ShadCN UI**
- Responsive for both desktop and mobile
- Centralized global state management using **Zustand**

---

## Tech Stack

| Area         | Tech Used                                      |
|--------------|------------------------------------------------|
| Frontend     | Next.js, React, TypeScript                     |
| UI Styling   | Tailwind CSS, ShadCN UI                        |
| Maps & GIS   | Mapbox GL JS, @turf/turf                       |
| State Mgmt   | Zustand (with `localStorage` persistence)     |
| Weather API  | [Open-Meteo API](https://open-meteo.com)       |
| AI (Optional)| Genkit + Google Gemini                         |

---

##  Getting Started

### 1. Prerequisites

Make sure you have:

- Node.js ≥ 18.x
- npm or yarn
- Git
- A [Mapbox API key](https://account.mapbox.com/)
- (Optional) Google Cloud account with Genkit if using AI

---

### 2. ⬇️ Clone the Repository

git clone https://github.com/iam-rbaskey/Map_Data_Analytics_Dashboard_NextJS_TypeScript.git
cd Map_Data_Analytics_Dashboard_NextJS_TypeScript

### 3. Install Dependencies

npm install
#### or
yarn install

### 4. Configure Environment Variables

Create a .env.local file:

#### Mapbox Access Token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

#### Optional: Open-Meteo API base
NEXT_PUBLIC_OPEN_METEO_API=https://api.open-meteo.com/v1/forecast

### 5. Run the Development Server

npm run dev
#### or
yarn dev

## Author
Riyanshu Baskey
GitHub: @iam-rbaskey
