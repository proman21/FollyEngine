FROM node:lts

COPY . /real-designer

WORKDIR /real-designer
RUN yarn install --frozen-lockfile --non-interactive

RUN yarn run build
