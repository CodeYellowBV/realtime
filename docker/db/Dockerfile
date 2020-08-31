FROM postgres:11.6
RUN apt-get update -qq && \
    apt-get install -qq postgresql-10-postgis-2.4 binutils libproj-dev gdal-bin openssh-server gosu > /dev/null

COPY .env .env
COPY docker/db/init docker-entrypoint-initdb.d

COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/db/runit /

ENTRYPOINT ["/runit"]
