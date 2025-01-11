## Use the latest Node.js LTS version for better performance
FROM node:18-alpine AS build-stage

# Set working directory for server application
WORKDIR /var/smart

# Copy package.json and package-lock.json files for dependency installation
COPY ./smart-server/package*.json ./

# Install server dependencies
RUN npm install --legacy-peer-deps

# Copy the server source files
COPY ./smart-server ./

# Build the server application
RUN npm run build

# Stage 2: Build the client application
FROM node:18-alpine AS client-stage

# Set working directory for client application
WORKDIR /var/smart/client

# Copy package.json and package-lock.json files for dependency installation
COPY ./smart-client/package*.json ./

# Install client dependencies
RUN npm install

# Copy the client source files
COPY ./smart-client ./

# Build the client application
RUN npm run build

# Stage 3: Create the production image
FROM node:18-alpine AS production-stage

# Set working directory
WORKDIR /var/smart

# Copy built server files from build-stage
COPY --from=build-stage /var/smart/dist ./dist

# Copy built client files
COPY --from=client-stage /var/smart/client/build ./client/build

# Install production dependencies
COPY ./smart-server/package*.json ./
RUN npm install --production --legacy-peer-deps

# Define the command to run the application
CMD ["node", "dist/main.js"]
