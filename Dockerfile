FROM sandrokeil/typescript

WORKDIR /app

RUN yarn global add @therealbytes/ticking-wrapper@latest

ARG COMMIT=""
ARG VERSION=""

LABEL commit="$COMMIT" version="$VERSION"
