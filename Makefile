# Globals; we can override this by passing the env var in the
# invocation command.
SHELL := /bin/bash
ENVIRONMENT ?= staging

# Colors for making things prettier.
magenta="\\033[34m"
green="\\033[32m"
yellow="\\033[33m"
cyan="\\033[36m"
white="\\033[37m"
reset="\\033[0m"

# Output help text for each command.
# Reference: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## execute this help command
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

#####################################################
#    ______   _______  __   __  _______  ___        #
#   |      | |       ||  | |  ||       ||   |       #
#   |  _    ||    ___||  |_|  ||    ___||   |       #
#   | | |   ||   |___ |       ||   |___ |   |       #
#   | |_|   ||    ___||       ||    ___||   |___    #
#   |       ||   |___  |     | |   |___ |       |   #
#   |______| |_______|  |___|  |_______||_______|   #
#                                                   #
#####################################################

init: develop migrate

ci:
	@echo "${white} \n> verifying python local enviornment${reset}\n"
	if [ ! -d "venv" ]; then python3 -m venv venv && source venv/bin/activate && pip install pip --upgrade && pip install -r requirements.txt; fi
	@echo "${white} deleting local postgresql data ${reset}\n"
	@echo "${white} > starting database(s) ${reset}\n";
	docker compose down;
	rm -rf ./postgres-data;
	docker compose up --detach redis postgres;
	venv/bin/python scripts/is_database_ready.py --database postgres://rec:rec@localhost:5432/rec;
	venv/bin/python manage.py makemigrations;	
	venv/bin/python manage.py migrate;
	source venv/bin/activate && coverage run --source='.' manage.py test;

develop: ## setup the local development environment
	@echo "Setting up the local development environment..."
	docker compose down;
	rm -rf ./postgres-data;
	docker compose up;
	

stop: ## stops docker containers.
	docker compose down;

migrate:  ## runs migrations.
	@echo "Running migrations..."
	docker compose exec web python3 manage.py makemigrations;
	docker compose exec web python3 manage.py migrate;

test: ## runs test test suite.
	@echo "${white} \n> running python test suite${reset}\n"
	docker-compose exec web python3 manage.py test;

coverage: ## generates coverate report.
	@echo "${white} \n> generating coverage reports${reset}\n"
	source venv/bin/activate && coverage report;
	source venv/bin/activate && coverage html;

##############################################################
#    ______   _______  __   __  _______  _______  _______    #
#   |      | |       ||  | |  ||       ||       ||       |   #
#   |  _    ||    ___||  |_|  ||   _   ||    _  ||  _____|   #
#   | | |   ||   |___ |       ||  | |  ||   |_| || |_____    #
#   | |_|   ||    ___||       ||  |_|  ||    ___||_____  |   #
#   |       ||   |___  |     | |       ||   |     _____| |   #
#   |______| |_______|  |___|  |_______||___|    |_______|   #
#                                                            #
##############################################################

tail-logs: ## tails logs from runningn app.
	heroku logs --app undercard-$(ENVIRONMENT) --tail;
