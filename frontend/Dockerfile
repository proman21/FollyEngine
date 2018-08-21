FROM node

WORKDIR /app
COPY ./real-designer/package.json ./
COPY ./real-designer/yarn.lock ./

RUN yarn global add @angular/cli \
  && yarn install --only=prod \
  && yarn install --only=dev

COPY ./real-designer .

ENTRYPOINT ["ng", "build", "--prod"]
