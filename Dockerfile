# Use an official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
