# Realtime

[![Build Status](https://travis-ci.org/CodeYellowBV/realtime.svg?branch=master)](https://travis-ci.org/CodeYellowBV/realtime)
[![codecov](https://codecov.io/gh/CodeYellowBV/realtime/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeYellowBV/realtime)

Realtime is a time tracking tool made from scratch for the needs of Code Yellow employees.

It is work in progress.

At Code Yellow we want to track time with few steps, and see what others are working on / have been working on. Toggl got close, but we don't want to rely on external services. We <3 open source.

## Requirements

```
apt-get install python3 python-virtualenv
```

- Node v4+
- npm v2+

## Install

```
source venv/bin/activate
pip install -r packages.pip
python manage.py db upgrade
```

## Running

### Development

1. `cd frontend; npm start`
1. `cd backend; source/venv/bin/activate; python manage.py runserver`
