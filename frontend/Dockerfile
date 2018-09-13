FROM node

WORKDIR /app

RUN yarn global add @angular/cli

COPY ./real-designer/package.json ./real-designer/yarn.lock /tmp/

# Install packages
RUN cd /tmp && yarn
RUN mkdir -p /app && cd /app && ln -s /tmp/node_modules

# Copy the code
COPY ./real-designer .

ENTRYPOINT ["ng", "build", "--prod"]
