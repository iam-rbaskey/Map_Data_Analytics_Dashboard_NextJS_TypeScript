# **App Name**: MeteoMapper

## Core Features:

- Interactive Map Display: Display an interactive map centered on a default location (e.g., Delhi) using Mapbox GL JS. The map will allow panning but zoom controls will be disabled, and zoom will be fixed.
- Polygon Drawing and Management: Enable users to draw polygons (3-12 points) on the map using Mapbox GL Draw, save the data source selected by the user when polygon is created, save polygon coordinates and metadata in the Zustand store.
- Timeline Slider: Implement a timeline slider using rc-slider to display a 30-day hourly range, centered around the present day. Use the slider handles to control the selected date/time, store it in Zustand, and show data and average values over selected time ranges.
- Data Fetching: Upon drawing a polygon or adjusting the timeline slider, fetch hourly data from the Open-Meteo Archive API based on the polygon's bounding box or centroid and the selected time range. Use 'temperature_2m' as the primary data source.
- Data Source and Color Rule Configuration: Create a side bar containing a dropdown menu to allow users to select different data sources from the API, and a table form where users may create conditional color rules. 
- Dynamic Color Coding: Dynamically update the color of polygons on the map based on the fetched data and the user-defined color rules, triggered by changes in the timeline slider or modifications to the polygon.
- Intelligent Data Refresh: Use a tool to intelligently manage and update the data presented in each polygon when refetching, especially dealing with averaged data over a selected period, only including values that will change the average, improving responsiveness.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke a sense of trustworthiness and scientific accuracy, aligned with the data-driven nature of the application.
- Background color: Very light blue-gray (#F0F4F8), a desaturated tint of the primary, providing a neutral backdrop that allows the data visualizations to stand out without causing eye strain.
- Accent color: Vivid orange (#FF9800), an analogous hue to the primary. It provides high contrast and serves to draw attention to important interactive elements such as active slider handles or selected polygons.
- Body and headline font: 'Inter', a sans-serif, for its modern, neutral, and readable qualities, suitable for both headers and body text, ensuring clarity across the dashboard.
- Crisp and minimalist icons for data representation and UI controls. Icons should be monochromatic in a tone that contrasts clearly against the background, ensuring they are easily discernible.
- The dashboard features a top-aligned timeline slider, a central interactive map, and a collapsible right sidebar for controls. Utilize a clear grid-based structure with ample spacing to reduce visual clutter.
- Subtle transitions and animations for polygon color changes on timeline adjustments. Polygons can subtly fade to their new colors, and the timeline slider can have a smooth transition effect when the range is adjusted.