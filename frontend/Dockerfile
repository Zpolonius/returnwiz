FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Vi bruger 'host' flaget for at Docker kan eksponere porten
CMD ["npm", "run", "dev", "--", "--host"]