FROM node
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
