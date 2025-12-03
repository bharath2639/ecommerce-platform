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

# 6. BUILD THE APPS (🔴 THIS IS THE MISSING STEP)
# This converts your TypeScript code into lightweight JavaScript in the 'dist' folder
RUN npx nx run-many --target=build --all

# 7. Default Command (We will override this in Render)
CMD ["node", "dist/apps/auth-service/main.js"]