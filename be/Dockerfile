FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (điều chỉnh theo port của bạn)
EXPOSE 5000

# Start application
CMD ["node", "index.js"]