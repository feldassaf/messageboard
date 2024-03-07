# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY ts*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

RUN npm run build

# Expose the port that your NestJS app will run on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]

# for debugging and keep
#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]