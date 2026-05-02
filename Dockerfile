# Use the official lightweight Nginx image
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 8080 for Cloud Run
EXPOSE 8080
