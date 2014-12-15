# Smart Citizen Scraper

Scrapes data from [Smart Citizen](https://www.smartcitizen.me/devices/all.geojson) for use in an environmental visualisation written in Unity.

Smart Citizen's API is limited to specific devices, but the website provides a [`.geojson`](https://www.smartcitizen.me/devices/all.geojson) file that contains the most recent sensor information for all devices. This script reads from that file and formats the data for use in the visualisation.