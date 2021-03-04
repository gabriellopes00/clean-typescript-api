<h1>
  Clean Typescript API
  <img src="https://cdn.svgporn.com/logos/typescript-icon.svg" alt="typescript" width="30" height="30"/>
</h1>

![version badge](https://img.shields.io/badge/version-1.5.0-blue.svg)
[![Build Status](https://travis-ci.org/gabriellopes00/clean-typescript-api.svg?branch=main)](https://travis-ci.org/gabriellopes00/clean-typescript-api)
[![Coverage Status](https://coveralls.io/repos/github/gabriellopes00/clean-typescript-api/badge.svg)](https://coveralls.io/github/gabriellopes00/clean-typescript-api)
![stars badge](https://img.shields.io/github/stars/gabriellopes00/clean-typescript-api.svg)
![license badge](https://img.shields.io/badge/license-MIT-blue.svg)

##### Application hosted at _[heroku](https://www.heroku.com/)_.

##### API url: _https://clean-typescript-api.herokuapp.com/_. See the [documentation](https://clean-typescript-api.herokuapp/api/docs).

###### An API mande with

<p>
  <img src="https://cdn.svgporn.com/logos/typescript-icon.svg" alt="typescript" width="30" height="30"/>
  <img src="https://img.icons8.com/color/452/mongodb.png" alt="mongodb" width="35" height="35"/>
  <img src="https://cdn.svgporn.com/logos/nodejs-icon.svg" alt="nodejs" width="30" height="30"/>
  <img src="https://cdn.svgporn.com/logos/docker-icon.svg" alt="docker" width="30" height="30"/>
  <img src="https://cdn.svgporn.com/logos/eslint.svg" alt="eslint" width="30" height="30"/>
  <img src="https://cdn.svgporn.com/logos/jest.svg" alt="jest" height="30">
  <img src="https://cdn.svgporn.com/logos/heroku-icon.svg" alt="heroku" height="30">
  <img src="https://cdn.svgporn.com/logos/travis-ci.svg" alt="travis-ci" height="30">
</p>

## About this project ⚙

This is an API made in [NodeJs, Typescript, TDD, Clean Architecture e SOLID Course](https://www.udemy.com/course/tdd-com-mango/), course led by [Rodrigo Mango](https://github.com/rmanguinho). In this course we develop an API using Node.JS, Typescript, Mongodb and all good programming practices, such as Clean Architecture, SOLID principles, TDD and Design Patterns. 🖋 Although i did this project following the course, i made my own changes and improvements.

## Building 🔧

You'll need [Node.js](https://nodejs.org), [Mongodb](https://www.mongodb.com/) and i recommend that you have installed the [Yarn](https://yarnpkg.com/getting-started/install) on your computer. After, you can run the scripts below...

###### Cloning Repository

```cloning
git clone https://github.com/gabriellopes00/clean-typescript-api.git &&
cd clean-typescript-api &&
yarn install || npm install
```

###### Running API (development environment)

```development
yarn dev || npm run dev
```

###### Generating Build and running build

```build
yarn build && yarn start || npm run build && npm run start
```

###### Docker 🐳

You will need to have [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed on your computer to run the commands below. Running this commands the containers will be pulled [node:14](https://hub.docker.com/_/node) image and [mongo:4](https://hub.docker.com/_/mongo) image, and the containers will be created on top of this images.

```upping
yarn up || npm run up
```

```downing
yarn down || npm run down
```

###### Tests (jest) 🧪

- _**All**_ ❯ `yarn test`
- _**Coverage**_ ❯ `yarn test:ci`
- _**Watch**_ ❯ `yarn test:watch`
- _**Unit**(.spec)_ ❯ `yarn test:unit`
- _**Integration**(.test)_ ❯ `yarn test:integration`
- _**Staged**_ ❯ `yarn test:staged`
- _**Verbose**(view logs)_ ❯ `yarn test:verbose`

###### Lint (eslint) 🎭

- _**Lint**(fix)_ ❯ `yarn lint`

###### Debug 🐞

- _**Debug**_ ❯ `yarn debug`

###### Statistics of the types of commits 📊📈

Following the standard of the [Conventional Commits](https://www.conventionalcommits.org/).

- _**feature** commits(amount)_ ❯ `git shortlog -s --grep feat`
- _**test** commits(amount)_ ❯ `git shortlog -s --grep test`
- _**refactor** commits(amount)_ ❯ `git shortlog -s --grep refactor`
- _**chore** commits(amount)_ ❯ `git shortlog -s --grep chore`
- _**docs** commits(amount)_ ❯ `git shortlog -s --grep docs`
- _**build** commits(amount)_ ❯ `git shortlog -s --grep build`

## Contact 📱

[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=https://github.com/gabriellopes00)](https://github.com/gabriellopes00)
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/gabriel-lopes-6625631b0/)](https://www.linkedin.com/in/gabriel-lopes-6625631b0/)
[![Twitter Badge](https://img.shields.io/badge/-Twitter-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=twitter&logoColor=white&link=https://twitter.com/_gabrielllopes_)](https://twitter.com/_gabrielllopes_)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-D14836?&style=flat-square&logo=Gmail&logoColor=white&link=mailto:gabrielluislopes00@gmail.com)](mailto:gabrielluislopes00@gmail.com)
[![Facebook Badge](https://img.shields.io/badge/facebook-%231877F2.svg?&style=flat-square&logo=facebook&logoColor=white)](https://www.facebook.com/profile.php?id=100034920821684)
[![Instagram Badge](https://img.shields.io/badge/instagram-%23E4405F.svg?&style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/_.gabriellopes/?hl=pt-br)
[![StackOverflow Badge](https://img.shields.io/badge/stack%20overflow-FE7A16?logo=stack-overflow&logoColor=white&style=flat-square)](https://stackoverflow.com/users/14099025/gabriel-lopes?tab=profile)
