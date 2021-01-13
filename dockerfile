FROM node:14
WORKDIR /usr/src/clean-typescript-api
COPY ./package.json .
RUN yarn install --only=prod
COPY ./dist ./dist
EXPOSE 5050
CMD yarn start