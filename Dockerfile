FROM node:16-alpine3.13

# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 1337
CMD [ "node", "app.js" ]