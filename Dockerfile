FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# התקנות נוספות ל־ffmpeg (אם תשתמש בו)
RUN apt-get update && \
    apt-get install -y ffmpeg

# העתק את כל הקבצים
WORKDIR /app
COPY . .

# התקנת חבילות
RUN npm install

# הגדרת הפורט
ENV PORT=3000
EXPOSE 3000

# הרצת השרת עם xvfb
CMD ["xvfb-run", "--auto-servernum", "--server-args=-screen 0 1280x720x24", "node", "index.js"]
