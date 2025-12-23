# Sử dụng Node.js phiên bản 18 Alpine (nhẹ)
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package files trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

COPY . .

EXPOSE 3001

# Biến môi trường
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]