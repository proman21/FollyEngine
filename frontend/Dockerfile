FROM node

WORKDIR /app
COPY ./real-designer/package*.json ./
RUN npm install --only=prod
RUN npm install --only=dev

COPY ./real-designer .

RUN npm install -g @angular/cli
ENTRYPOINT ["ng", "build", "--prod"]
