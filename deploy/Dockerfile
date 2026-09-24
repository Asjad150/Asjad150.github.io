# Static portfolio served by nginx.
# Build from the project root:  docker build -f deploy/Dockerfile -t portfolio .
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html .nojekyll /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY data /usr/share/nginx/html/data
EXPOSE 80
