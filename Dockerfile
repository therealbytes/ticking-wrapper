FROM sandrokeil/typescript

WORKDIR /app

RUN yarn global add @therealbytes/ticking-wrapper

ARG COMMIT=""
ARG VERSION=""

LABEL commit="$COMMIT" version="$VERSION"
