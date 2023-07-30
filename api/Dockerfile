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
ENV NODE_ENV production
RUN pnpm install
COPY --from=0 /app/dist .
COPY --from=0 /app/prisma .
RUN npx prisma generate
EXPOSE 8000
EXPOSE 5432
CMD ["pm2-runtime","src/index.js"]