# AeroRoute Valhalla Setup

This folder contains helper notes for running Valhalla locally.

## Current Local State

- Docker CLI is installed.
- Docker Desktop daemon is running.
- Valhalla is cloned at `../valhalla`.
- Valhalla scripted Docker image is configured in `../docker-compose.valhalla.yml`.
- The North America PBF was deleted.
- A GTA BBBike `.osm.pbf` extract is ready at `../custom_files/gta.osm.pbf`.
- Valhalla local service is running at `http://localhost:8002`.
- Test bicycle route succeeded at `28.213 km`.

## Recommended Next Move

Use the smaller GTA BBBike extract first.

Put the GTA `.osm.pbf` file here:

```text
C:\AeroRoute\custom_files\gta.osm.pbf
```

Before the first GTA build, clear old generated Valhalla outputs from `custom_files`, but keep the GTA `.osm.pbf` once you place it there.

## Start Valhalla

Start Docker Desktop first. Then run from `C:\AeroRoute`:

```powershell
docker compose -f docker-compose.valhalla.yml up -d
```

Watch the build logs:

```powershell
docker logs -f aeroroute-valhalla
```

`docker logs -f` follows the live log stream. If Valhalla is already running, the terminal may look like it is waiting. Press `Ctrl+C` to stop watching logs; this does not stop the container.

When the logs say the Valhalla service has started, test a bicycle route:

```powershell
.\routing\test-valhalla-route.ps1
```

## Useful Commands

Stop the service:

```powershell
docker compose -f docker-compose.valhalla.yml down
```

Force a rebuild after changing the `.osm.pbf` file:

```powershell
docker compose -f docker-compose.valhalla.yml down
docker compose -f docker-compose.valhalla.yml up -d
```

If it still reuses old tiles, delete generated Valhalla outputs in `custom_files`, but keep the `.osm.pbf` file:

```text
valhalla_tiles
valhalla_tiles.tar
admins.sqlite
timezones.sqlite
file_hashes.txt
```
