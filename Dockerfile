## Install NodeJS - resources are built using NodeJS packages
FROM node:16-alpine

# Stage 1: Build The Server Application

# Set the working directory to the server application's installation location
WORKDIR /var/smart

## Copy the server source files to the image
COPY ./smart-server .

## Install the application's resources
RUN npm install

## Build the application
RUN npm run build

# Stage 2: Build The Client Application (SPA)

# Set the working directory 
WORKDIR /var/smart/client

# Copy the client source files to the image under the client directory
COPY ./smart-client .

# Install the spa's resources
RUN npm install

# Build the spa
RUN npm run build

CMD ["node", "/var/smart/dist/main.js"]