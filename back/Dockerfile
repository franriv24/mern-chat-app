# Backend Dockerfile
FROM node:20.18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "dev"]
