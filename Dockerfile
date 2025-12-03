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

# Build ONLY backend services (skip 'shop') and do it one by one to save memory
RUN npx nx run-many --target=build --projects=auth-service,product-service,order-service --parallel=1

# 7. Default Command (We will override this in Render)
CMD ["node", "dist/apps/auth-service/src/main.js"]