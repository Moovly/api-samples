# This file is to host the demo on our documentation platform. You don't need this.

FROM nginx

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /website_files

RUN rm -rf *

ADD ./automator-react/build /var/www
ADD ./automator-react/docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf