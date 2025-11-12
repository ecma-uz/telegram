#!/usr/bin/env just --justfile

start:
	deno run --allow-all main.ts --config=./config.toml

dev:
	deno run --watch-hmr --allow-all main.ts --config=./config.toml

fmt:
	deno fmt

lint:
	deno lint

cache:
	deno cache ./deps.ts
