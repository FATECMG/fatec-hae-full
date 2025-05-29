FROM      node:18-alpine as builder

WORKDIR   /app

COPY      package.json yarn.lock ./

RUN       yarn && yarn add tsup --dev

COPY      . ./

RUN       yarn build

FROM      node:18-alpine as runner

WORKDIR   /app

COPY      --from=builder /app/package.json /app/yarn.lock ./

RUN       yarn install --production

COPY      --from=builder /app/dist ./dist

ARG       PORT=3000

ENV       PORT=${PORT}

EXPOSE    ${PORT}

CMD       ["yarn", "run:docker"]
