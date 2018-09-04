FROM node

WORKDIR /app
COPY ./real-designer/package.json ./
COPY ./real-designer/yarn.lock ./

RUN yarn global add @angular/cli \
RUN yarn install --production=false

COPY ./real-designer .

ENTRYPOINT ["ng", "build", "--prod"]
