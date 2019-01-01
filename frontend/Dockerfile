FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=registry.gitlab.com/synthsym/follyengine/frontend-build:latest \
  /real-designer/dist/ /var/www/html
