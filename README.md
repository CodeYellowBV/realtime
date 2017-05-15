# Realtime ⏰

[![Build Status](https://travis-ci.org/CodeYellowBV/realtime.svg?branch=master)](https://travis-ci.org/CodeYellowBV/realtime)
[![codecov](https://codecov.io/gh/CodeYellowBV/realtime/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeYellowBV/realtime)

Realtime is a time tracking tool made from scratch for the needs of Code Yellow employees.

At Code Yellow we want to track time with few steps, and see what others are working on / have been working on. Toggl got close, but we don't want to rely on external services. This is why we built our own Open Source variant.

TODO: fancy gif

## Requirements

For the frontend:

- Node v6+
- npm v3+ or Yarn

For the backend:

- Python 3 (`apt-get install python3`)
- Python virtualenv (`apt-get install python-virtualenv`)
- Postgresql

The backend should work on Linux and Mac, but not Windows. For installation details with Debian, checkout the `scripts/` folder in our [Vagrant repository](https://github.com/CodeYellowBV/realtime-vagrant).

## Install

```
cd frontend && yarn
```

```
cd backend
virtualenv --python=python3 venv
source venv/bin/activate
pip install -r packages.pip
./manage.py db upgrade
```

## Running

### Development

1. `cd frontend; yarn start`
1. `cd backend; source/venv/bin/activate; ./manage.py runserver`
