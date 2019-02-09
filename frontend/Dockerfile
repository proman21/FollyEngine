FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=registry.gitlab.com/synthsym/follyengine/frontend-build:latest \
  /real-designer/dist/ /var/www/html
