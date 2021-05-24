FROM node:15-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM node:15-alpine AS run

ENV NODE_ENV production
EXPOSE 3000

WORKDIR /app
COPY package.json package-lock.json next.config.js schema.prisma ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

CMD npm start
