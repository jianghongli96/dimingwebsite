FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json ./
COPY server.js ./server.js
COPY public ./public

ENV NODE_ENV=production
ENV PORT=4000
ENV CMS_DATA_DIR=/data
ENV CMS_UPLOAD_DIR=/uploads

RUN mkdir -p /data /uploads

EXPOSE 4000

CMD ["npm", "start"]
