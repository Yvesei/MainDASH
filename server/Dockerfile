FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY --chown=node:node . .
RUN mkdir -p public/uploads/tasks public/uploads/users \
  && chown -R node:node public/uploads

ENV NODE_ENV=production
EXPOSE 3000
USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node seeds/seed.js && node bin/www"]
