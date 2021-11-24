FROM node:12
RUN npm install -g http-server
WORKDIR /app
COPY /dist/ .
ENV PORT=8282
EXPOSE 8282
CMD http-server -a 0.0.0.0 -p 8282