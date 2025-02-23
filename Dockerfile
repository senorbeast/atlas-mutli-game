# Use the official Node.js image as the base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN pnpm run build

# Specify the command to start the Next.js app
CMD ["pnpm", "start"]
