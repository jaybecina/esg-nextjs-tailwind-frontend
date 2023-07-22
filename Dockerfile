FROM node:16-alpine AS builder

# set working directory
WORKDIR /app

# copy required files
COPY package.json ./
COPY yarn.lock ./

# install app dependencies
RUN yarn install --frozen-lockfile

# add app to workdir
COPY . ./

# build
RUN yarn run build

# production with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

# start app
# CMD ["npx", "serve", "-s" "build"]