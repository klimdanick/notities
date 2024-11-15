# Notes api

## Install

Clone the repo and install dependencies:

```bash
git clone <repo>
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm run dev
```

### To get the apispec localy

```bash
npm run apispec
npm run dev
```

And navigate to `localhost:8080/api-docs`

### Public api spec

available on `http://vps.klimdanick.nl:8080/api-docs`

## Packaging for Production

To build and run the api:

```bash
npm run build
npm start
```
