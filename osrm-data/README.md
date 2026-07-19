# OSRM Map Data

`docker-compose.yml` expects a pre-processed OSRM dataset in this folder as
`map.osrm` (plus its companion files). This is a one-time step per region.

```bash
cd osrm-data

# 1. Download an OSM extract for your region, e.g. Delhi via Geofabrik/BBBike,
#    and save it here as map.osm.pbf

# 2. Extract, partition, and customize (MLD algorithm, matches docker-compose)
docker run -t -v "$PWD:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/map.osm.pbf
docker run -t -v "$PWD:/data" osrm/osrm-backend osrm-partition /data/map.osrm
docker run -t -v "$PWD:/data" osrm/osrm-backend osrm-customize /data/map.osrm

# 3. Start the stack
cd ..
docker compose up -d
```


