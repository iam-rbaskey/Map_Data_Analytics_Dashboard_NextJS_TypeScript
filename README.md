An Interactive GIS Data Visualization Tool

It is a sophisticated, web-based dashboard designed for visualizing time-series geospatial data. It empowers users to draw custom polygonal regions on an interactive map, connect them to real-world weather data, and define custom, rule-based color schemes to see how data changes over time and space.

The application is built with a modern, component-based architecture and leverages a powerful set of technologies to deliver a seamless and interactive user experience.

## Core Features

- **Interactive Map Display**: Utilizes Mapbox GL JS to render a high-performance, interactive map. Users can pan across the map, with a fixed zoom level to maintain a consistent area of analysis (2 sq. km).

- **Dynamic Timeline Control**:
    - A versatile timeline slider allows for data exploration across a 30-day window.
    - Supports both **single-point** (a specific hour) and **range-based** (a window of time) selection.
    - Features selectable time units (**Hour, Day, Week**) to adjust the granularity of the analysis.
    - Includes **playback controls** (play, pause, step forward/backward) to animate the data visualization over time.

- **Polygon Drawing & Management**:
    - Users can draw custom polygons (with 3 to 12 vertices) directly on the map.
    - A dedicated sidebar allows users to view a list of all drawn polygons, select them for editing, and delete them.
    - Polygon geometries and their associated rules are persisted in the browser's `localStorage`, saving work between sessions.

- **Rule-Based Data-Driven Styling**:
    - Each polygon can be assigned a data source (e.g., temperature, humidity).
    - A powerful rule engine allows users to define conditional color-coding. For example, a user can set a rule like `temperature > 25°C → Red`.
    - Polygons automatically update their color on the map as the data for the selected time window changes, providing instant visual feedback.

- **Real-Time API Integration**:
    - Fetches historical weather data from the **Open-Meteo API**.
    - Dynamically constructs API requests based on the polygon's location (centroid) and the selected time window from the slider.

- **AI-Enhanced Data Refresh**:
    - Integrates a **Genkit AI flow** to intelligently manage data updates.
    - The AI analyzes incoming data to determine if changes are significant enough to warrant a visual refresh, optimizing performance by avoiding unnecessary re-renders for minor fluctuations.

- **Responsive & Modern UI**:
    - Built with a clean, dark-themed interface suitable for analytics applications.
    - The layout is fully responsive and adapts for use on both desktop and mobile devices.

## Technology Stack

### Frontend

- **Next.js**: The core React framework, providing a robust foundation with features like Server Components and an App Router-based architecture.
- **React**: Used for building the component-based, interactive user interface.
- **TypeScript**: Ensures type safety and improves code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for creating the custom, responsive design.
- **ShadCN UI**: Provides a set of beautifully designed and accessible UI components that serve as the building blocks for the dashboard's interface (e.g., sliders, dialogs, buttons).
- **Zustand**: A lightweight state management library used for managing global application state for polygons and the timeline, with middleware for `localStorage` persistence.

### Geospatial

- **Mapbox GL JS**: The primary library for rendering the interactive map and handling user drawing interactions.
- **@turf/turf**: A JavaScript library for advanced geospatial analysis, used here to calculate the centroid of polygons for API queries.

### Generative AI

- **Genkit**: The framework used to create and manage the AI flow for intelligent data refresh. It provides the structure for defining prompts, schemas, and orchestrating calls to the generative model.
- **Google Gemini**: The underlying large language model used by the Genkit flow to perform the data analysis.

## Architectural Overview

The application is structured around a few key concepts:

1.  **Component-Driven UI**: The interface is broken down into reusable React components (`Dashboard`, `InteractiveMap`, `TimelineSlider`, `Sidebar`, etc.), making the codebase modular and easier to maintain.

2.  **Centralized State Management**: Global state (like the list of polygons, their rules, and the current timeline settings) is managed in **Zustand stores**. This allows different components to share and react to state changes without complex prop-drilling.

3.  **Event-Driven Data Flow**: User interactions with the **Timeline Slider** or the **Polygon Manager** in the sidebar trigger state updates in the Zustand stores. The main Dashboard component listens for these changes via a useEffect hook.

4.  **Dynamic Data Fetching**: When a state change is detected, the Dashboard component orchestrates the data fetching process. It calculates the necessary parameters (like location and date range), calls a utility function to fetch data from the **Open-Meteo API**, and processes the results.

5.  **Reactive Map Updates**: Based on the (potentially AI-filtered) data, a color is calculated using a custom utility function. This new color and data are saved back to the Zustand store. The InteractiveMap component, also subscribed to the store, detects this change and re-renders the polygons on the map with their new colors.


