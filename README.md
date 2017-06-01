# Thermostat Web-Client

AngularJS & Patternfly Application: Thermostat UI

[![Chat](https://img.shields.io/badge/chat-on%20freenode-brightgreen.svg)](https://webchat.freenode.net/?channels=#thermostat)

## Dependencies:

`npm`, which will pull down all other dependencies.

`keycloak.json` generated by a Keycloak server (if desired, ie, running with
`NODE_ENV=production`), placed in `src/app/components/auth/`. The file contents should
look like:

    {
        "url": "http://some.domain:PORT/auth",
        "realm": "FooRealm",
        "clientId": "BarClientId"
    }

## Environments

`GATEWAY_URL` should be set to the URL of a Thermostat Web-Gateway instance.
The default value of this variable is the default URL for the web-client
mockapi server.

Expected values for `NODE_ENV`:

- `production` for production environments, which produces a smaller application
bundle and expects Keycloak configuration

- `testing` for test environments, ex. CI

- `development` for individual developers' machines

In `testing` and `development`, one hard-coded user exists. The username is
`test-user` and the password is `test-pass`. This is intended _only_ for
development and testing, never for deployments.

When building with `npm run build`, these values should be set via a standard
shell environment variable. When building with `s2i build`, the file `.s2i/environment`
should exist and contain ex. `NODE_ENV=production`.

## How to use

**Live-reload development:**

`npm run devserver`, then point a web browser at localhost:8080.

**One-time build:**

`npm run build` for a build with unit tests but *not* integration tests, or

`npm run verify` for a build with unit tests and integration tests. This
requires the embedded webserver and mockapi-server to be able to run and bind
on their respective ports, as described below.

**Non-live-reload web-server:**

`npm start`, then point a web browser at localhost:8080.

In this case, you may run the server on a different port than the default `8080`
by setting the environment variable `PORT` to a port number of your choosing.
The server also binds by default on `0.0.0.0`, which can be overridden with the
environment variable `HOST`.

This will also bring up the mock API endpoint server, which by default will run
on port `8888` and bind to `0.0.0.0`. These can be overridden with the
environment variables `MOCKAPI_PORT` and `MOCKAPI_HOST`.

The webserver and mockapi-server are both run as daemons. They can be stopped
using `npm stop`.

**Testing**

Unit tests are run with both `npm run build` and `npm run verify`, but
integration tests are only run on `npm run verify`.

To run unit tests separately from a build, use `npm test` for a one-shot test
suite execution, or `npm run test-watch` to monitor test files and rerun the
suite when any test file changes.

To run integration tests separately, use `npm run integration-test`. This will
require the embedded webserver to be running, using ex. `npm start`.

### Source-to-Image

`s2i` can also be used to produce an application image. The expected base image
is `centos/nodejs-4-centos7`, although others may also work. The build invocation
will look like `s2i build . centos/nodejs-4-centos7 thermostat-web-client` and
running the image will look like `docker run -it --rm -p 8888:8080 thermostat-web-client`,
which will bind the application to port 8888 on the host machine.

The `PORT` and `HOST` variables outlined above may also be set in `.s2i/environment`.

### OpenShift

In order to deploy this web-client on OpenShift do:

    $ oc new-app centos/nodejs-4-centos7~https://github.com/andrewazores/thermostat-web-client

## Keycloak Configuration

Follow the Thermostat Web-Gateway configuration guide for Keycloak. See the
top of this file for where to place the generated `keycloak.json`.

Additionally, configure the Client on the Keycloak Server with the following
parameters:

`Valid Redirect URIs: http://localhost:8080/*` (or similar)

`Web Origins: +`
