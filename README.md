# CY Time

[![Build Status](https://travis-ci.org/CodeYellowBV/cy-time.svg?branch=master)](https://travis-ci.org/CodeYellowBV/cy-time)
[![codecov](https://codecov.io/gh/CodeYellowBV/cy-time/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeYellowBV/cy-time)

CY Time is a time tracking tool made from scratch for the needs of Code Yellow employees.

It is work in progress.

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
