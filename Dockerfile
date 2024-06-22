FROM node

WORKDIR /

COPY package*.json .

RUN npm install

COPY . .

#CMD ["tail", "-f", "/dev/null"]
CMD ["node", "src/index.js"]
