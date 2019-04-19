# Use an official Python runtime as a parent image
FROM node:10

# Set the working directory to /app
WORKDIR /app/endpoint

# Copy the current directory contents into the container at /app
COPY . /app/endpoint

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD ["npm", "start"]