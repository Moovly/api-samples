# API Samples

This repository houses the API Samples for the Moovly API. If you are looking for documentation, you need to go to
[https://developer.moovly.com/docs/api](https://developer.moovly.com/docs/api).

## Automator PHP

1. Change $projectTemplateId and $accessToken
2. Install dependencies with Composer
3. Run

```
php -f automator-php/app.php
```

## Automator React

If you have docker installed:

```bash
$ cd automator-react
$ docker-compose run --rm install
$ docker-compose up -d
```

If you have a local node version installed (^8):

```bash
$ yarn install #or npm install
$ yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000)
