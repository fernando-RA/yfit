#!/bin/bash
# If you want to test a specific test case, simply set the DJANGO_TEST_CASE
# environment variable. Leave unset to run all test cases.
DC=$(which docker-compose)
${DC} exec web poetry run ./manage.py test ${DJANGO_TESTCASE}