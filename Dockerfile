FROM sandrokeil/typescript
ARG MODULE_VERSION

WORKDIR /app

RUN yarn global add @therealbytes/ticking-wrapper@$MODULE_VERSION

ARG COMMIT=""
ARG VERSION=""

LABEL commit="$COMMIT" version="$VERSION"
