# 1. Use Node.js Base Image
FROM node:18-alpine

# 2. Create App Directory
WORKDIR /app

# 3. Copy Dependency Files
COPY package*.json ./

# 4. Install Dependencies
RUN npm install

# 5. Copy Source Code
COPY . .

# 6. Default Command (Will be overridden in docker-compose)
CMD ["npx", "nx", "serve", "auth-service", "--host", "0.0.0.0"]