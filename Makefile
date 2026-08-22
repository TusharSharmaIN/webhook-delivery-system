.PHONY: up down build logs logs-core logs-source logs-receiver ps clean restart test

up: ## Build (if needed) and start all services in the background
	docker compose up -d --build

up-d: ## Start all services in the background
	docker compose up -d

down: ## Stop and remove all containers (keeps volumes/data)
	docker compose down

up-d-core-api:
	docker compose up -d --build --force-recreate core-api

up-d-event-source:
	docker compose up -d --build --force-recreate event-source
 
build: ## Rebuild all images without starting
	docker compose build
 
logs: ## Tail logs from all services
	docker compose logs -f
 
logs-core: ## Tail logs from core-api only
	docker compose logs -f core-api
 
logs-source: ## Tail logs from event-source only
	docker compose logs -f event-source
 
logs-receiver: ## Tail logs from receiver only
	docker compose logs -f receiver
 
ps: ## Show status of all services
	docker compose ps
 
restart: ## Restart all services
	docker compose restart
 
clean: ## Stop everything and wipe volumes (DB data included) — full reset
	docker compose down -v
 
test: ## Placeholder — real test commands land per-phase
	@echo "No automated tests yet — Phase 1 is verified manually via health checks."