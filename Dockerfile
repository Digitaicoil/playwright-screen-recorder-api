FROM mcr.microsoft.com/playwright:focal

RUN apt-get update && apt-get install -y xvfb ffmpeg

WORKDIR /app
COPY . .

RUN npm install

ENV DISPLAY=:99
EXPOSE 3000

CMD ["xvfb-run", "--auto-servernum", "--server-args=-screen 0 1280x720x24", "node", "index.js"]
