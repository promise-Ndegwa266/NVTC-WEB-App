FROM node:22-alpine

WORKDIR /src

# Copy package files first to cache dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .
COPY .env .env

EXPOSE 3000
CMD [ "npm", "run", "dev" ]

