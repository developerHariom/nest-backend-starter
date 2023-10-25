# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all source code to the container
COPY . .

# Expose the port that your Node.js application will run on
EXPOSE 8000

# Specify the command to run your application
CMD ["node", "app.js"]
