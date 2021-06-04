FROM node:14-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM nikolaik/python-nodejs:python3.9-nodejs14-alpine AS run

RUN pip install -r requirements.txt

ENV NODE_ENV production
EXPOSE 3000

WORKDIR /app
COPY package.json package-lock.json next.config.js schema.prisma ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

CMD npm start
