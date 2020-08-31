FROM debian:buster-20200224-slim

ARG NODE_VERSION="node_12.x"

# Install dependencies.
COPY docker/frontend/keys/ keys/
RUN apt-get update -qq && \
    apt-get install -qq --no-install-recommends apt-transport-https gnupg ca-certificates gosu curl rsync > /dev/null && \
    apt-key add keys/* && \
    rm -rf keys && \
    echo "deb https://deb.nodesource.com/$NODE_VERSION stretch main" | tee /etc/apt/sources.list.d/nodesource.list && \
    echo "deb-src https://deb.nodesource.com/$NODE_VERSION stretch main" | tee -a /etc/apt/sources.list.d/nodesource.list && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -qq && \
    apt-get install -qq --no-install-recommends git nodejs yarn > /dev/null

# Set default timezone to Europe/Amsterdam.
RUN ln -fs /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

COPY frontend/package.json /frontend/package.json
COPY frontend/yarn.lock /frontend/yarn.lock
COPY .env .env
RUN export $(cat .env | grep -v '#' | awk '/=/ {print $1}') && sed -i "s/CY_PACKAGE_NAME/$CY_PACKAGE_NAME/g" /frontend/package.json
COPY frontend/craco.config.js /frontend/craco.config.js
RUN cd frontend && yarn install && yarn cache clean



COPY frontend/public/ /frontend/public
COPY frontend/src/ /frontend/src
COPY frontend/.eslintrc /frontend/.eslintrc

# Run app.
COPY docker/entrypoint.sh /entrypoint.sh
WORKDIR /frontend
EXPOSE 3000/tcp
ENTRYPOINT ["/entrypoint.sh", "yarn"]
CMD ["start"]
