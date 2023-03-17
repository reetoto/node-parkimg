FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/nodejs-parking
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/nodejs-parking
USER node
CMD ["npm", "start"]
