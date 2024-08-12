# Gunakan image Node.js sebagai base image
FROM node:18-bullseye-slim

# Install build tools untuk kompilasi modul native
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install bcrypt
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

RUN npm run prisma-client

# Kompilasi TypeScript ke JavaScript
RUN npm run compile

# Jalankan Prisma generate untuk membuat client

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Tentukan perintah untuk menjalankan aplikasi
CMD ["npm", "run", "start"]
