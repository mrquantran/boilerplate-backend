FROM node:17.3

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY . . 
RUN npm install
RUN npm run postinstall

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate
RUN npx prisma migrate

EXPOSE 5000

CMD nodemon src/index.js


