FROM "node:18-alpine"
RUN npm install -g pnpm@8.X
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm build

FROM "node:18-alpine"
RUN npm install -g pnpm@8.X
RUN npm install -g pm2
WORKDIR /app
COPY package.json ./
RUN pnpm install --prod
COPY --from=0 /app/dist .
COPY --from=0 /app/prisma prisma
RUN npx prisma generate
EXPOSE 8000
CMD npx prisma migrate deploy && pnpm db:seed:prod && pm2-runtime "src/index.js"