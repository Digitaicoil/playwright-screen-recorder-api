FROM mcr.microsoft.com/playwright:focal

# Install xvfb and ffmpeg
RUN apt-get update && apt-get install -y xvfb ffmpeg

WORKDIR /app
COPY . .

RUN npm install

ENV DISPLAY=:99

# Run using Xvfb
CMD xvfb-run --server-args="-screen 0 1280x720x24" node index.js
