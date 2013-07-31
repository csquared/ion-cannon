# ion-cannon

multi-protocol concurrent connection load tester

uses all CPUs on host machine

## install

    > npm install ion-cannon

## use

    > ion-cannon [url] -i/--interval [interval in ms] -c [concurrency]

Defaults to 1 second interval with concurrency of 1

Protocol is derived from the url.

## Currently Supported Protocols:

- MQTT via `mqtt://`
- Websockets via `ws://`

## examples

Open 100 connections and send data every 10ms to a WebSocket server

    > ion-cannon ws://localhost:8080/ -i 10 -c 100

Open 10K connections and send data every 100ms to an MQTT server

    > ion-cannon mqtt://localhost:8080/ -i 100 -c 10000

## Future Protocols:

- HTTP Keepalive
