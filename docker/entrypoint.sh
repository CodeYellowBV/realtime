#!/bin/sh

USER_ID=${LOCAL_USER_ID:-9001}
GROUP_ID=${LOCAL_GROUP_ID:-9001}

# Create user with matching group, but only if it doesn't exist yet
id user > /dev/null 2>&1 || groupadd -g $GROUP_ID user
id user > /dev/null 2>&1 || useradd --shell /bin/bash -u $USER_ID -g $GROUP_ID -o -c "" -m user
export HOME=/home/user

# Use gosu to execute the requested program; we can't use su or sudo
# because those don't properly pass through TTY and other env vars.
# See https://denibertovic.com/posts/handling-permissions-with-docker-volumes/
# for more info
exec gosu user "$@"
