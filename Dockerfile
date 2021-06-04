FROM node:14 AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM nikolaik/python-nodejs:python3.9-nodejs14 AS run

ENV NODE_ENV production
EXPOSE 3000

WORKDIR /app
COPY package.json package-lock.json next.config.js schema.prisma ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/public ./public
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/.next ./.next
COPY --from=build /app/requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

CMD npm start
