FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# This generates the dist/ folder that contains the final static files
RUN npm run build 

# Now, forget the prior image and create a new nginx image that will serve the final files to the user
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Retrieve the dist/ folder and place it where nginx serves the content
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
