adventure-reader
================

A Google reader replacement!

Requirements
================
* Python(with virtualenv)
* Node.js
* PostgreSQL

* A google API key to allow signin

Getting started
===============

After succesful pull of the repo, run `virtualenv python-backend`.
Then cd to python-backend, and do `source bin/activate`. You are now ready to
install packages with "pip"!

Installing packages with pip
============================

Should be enough to run "pip install -r requirements.txt"

Node.js frontend
============================
an `npm install` from within the frontend directory should be enough.
Currently the service is split in to, one for the API and one for static content. 
An nginx configuration should be included to have both services running under the same "domain".

