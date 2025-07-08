FROM mcr.microsoft.com/playwright:v1.53.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
