FROM mcr.microsoft.com/playwright:focal

# Install xvfb + ffmpeg
RUN apt-get update && apt-get install -y xvfb ffmpeg

WORKDIR /app

COPY . .

RUN npm install

ENV DISPLAY=:99
EXPOSE 3000

# Wrap xvfb-run in bash to prevent startup crash
CMD ["bash", "-c", "echo 🚀 Starting container && xvfb-run --server-args='-screen 0 1280x720x24' node index.js || echo ❌ App crashed"]

