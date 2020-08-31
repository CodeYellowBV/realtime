FROM debian:buster-20200224-slim

RUN apt-get update -qq && \
    apt-get install -qq --no-install-recommends git libjpeg-dev libpq-dev gettext binutils libproj-dev gdal-bin python-virtualenv postgresql-client postgresql-client-11 openssh-server python3 python3-pip python3-dev gcc python3-setuptools locales gosu > /dev/null && \
    rm -rf /var/cache/apk/* && \
    update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1 && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.7 2

RUN mkdir /run/sshd



# Set default timezone to Europe/Amsterdam.
RUN ln -fs /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

# App deps + src.
COPY backend/packages.pip /packages.pip
RUN pip3 install -qUr packages.pip
COPY docker/backend/runit /
COPY docker/entrypoint.sh /entrypoint.sh
COPY backend/ /backend
WORKDIR /backend

# Run app.
EXPOSE 8000/tcp
ENTRYPOINT ["/runit"]
