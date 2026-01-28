# Product Management Web Application

A modern web application for managing products using Node.js, Express, EJS, DynamoDB, and Amazon S3.

## 📋 Project Overview

This application demonstrates a complete CRUD (Create, Read, Update, Delete) web application built on AWS cloud services:
- **Backend:** Node.js with Express framework
- **Frontend:** EJS template engine with HTML/CSS
- **Database:** Amazon DynamoDB (NoSQL)
- **Storage:** Amazon S3 (for product images)
- **Deployment:** Amazon EC2

## 🎯 Features

- ✅ **View Products:** Display all products in an interactive table
- ✅ **Add Products:** Create new products with image upload
- ✅ **Edit Products:** Update product information and images
- ✅ **Delete Products:** Remove products and associated images from S3
- ✅ **Image Management:** Automatic upload to S3 and deletion when product is updated/deleted
- ✅ **Responsive Design:** Works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **EJS** - Template engine
- **Multer** - File upload handling

### AWS Services
- **DynamoDB** - NoSQL database for product data
- **S3** - Object storage for product images
- **EC2** - Application server (for deployment)
- **IAM** - Identity and Access Management

### Dependencies
```json
{
  "express": "^4.18.2",
  "ejs": "^3.1.9",
  "dotenv": "^16.3.1",
  "@aws-sdk/client-dynamodb": "^3.400.0",
  "@aws-sdk/client-s3": "^3.400.0",
  "@aws-sdk/lib-dynamodb": "^3.400.0",
  "uuid": "^9.0.0",
  "multer": "^1.4.5-lts.1"
}
```

## 📁 Project Structure

```
manager-product/
├── config/
│   ├── aws.js                 # AWS services configuration
│   └── database.js            # DynamoDB client setup
├── controllers/
│   └── productController.js   # CRUD business logic
├── routes/
│   └── products.js            # Route definitions
├── middleware/
│   ├── multer.js              # File upload configuration
│   └── errorHandler.js        # Error handling middleware
├── utils/
│   ├── dynamodb-helper.js     # DynamoDB operations
│   └── s3-helper.js           # S3 operations
├── views/
│   ├── layout.ejs             # Main layout template
│   ├── error.ejs              # Error page
│   └── products/
│       ├── list.ejs           # Product list page
│       ├── add.ejs            # Add product form
│       └── edit.ejs           # Edit product form
├── public/
│   └── css/
│       └── style.css          # Stylesheet
├── app.js                     # Express app entry point
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **AWS Account** - [Create one](https://aws.amazon.com/)
3. **AWS CLI** - [Install here](https://aws.amazon.com/cli/)

### 1. Setup Local Development

```bash
# Clone or download the project
cd c:\CNM\manager-product

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure AWS

#### Option A: Using IAM User (Development)

1. Create an IAM user in AWS Console
2. Attach policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
3. Generate Access Key ID and Secret Access Key
4. Configure AWS CLI:
   ```bash
   aws configure
   ```
5. Update `.env`:
   ```env
   AWS_REGION=ap-southeast-1
   AWS_DYNAMODB_TABLE_NAME=Products
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```

#### Option B: Using IAM Role (Production on EC2)

1. Create an IAM role with DynamoDB and S3 permissions
2. Attach the role to EC2 instance
3. No need to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
4. AWS SDK will automatically use the instance role

### 3. Create AWS Resources

#### Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name Products \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1
```

#### Create S3 Bucket

```bash
aws s3 mb s3://your-bucket-name --region ap-southeast-1

# Configure CORS for public image access
aws s3api put-bucket-cors \
  --bucket your-bucket-name \
  --cors-configuration file://cors.json \
  --region ap-southeast-1
```

Create `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 4. Update Environment Variables

Edit `.env` file:

```env
NODE_ENV=development
PORT=3000

# AWS Configuration
AWS_REGION=ap-southeast-1
AWS_DYNAMODB_TABLE_NAME=Products
AWS_S3_BUCKET_NAME=your-actual-bucket-name

# Optional: IAM User credentials (not recommended for production)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 5. Run the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Application will be available at `http://localhost:3000`

## 📖 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Display all products |
| GET | `/add` | Show add product form |
| POST | `/add` | Create new product |
| GET | `/edit/:id` | Show edit product form |
| POST | `/edit/:id` | Update product |
| POST | `/delete/:id` | Delete product |

## 💾 Data Model

### Products Table (DynamoDB)

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | String (PK) | Unique product ID (UUID) |
| `name` | String | Product name |
| `price` | Number | Product price (USD) |
| `quantity` | Number | Stock quantity |
| `url_image` | String | S3 URL of product image |
| `createdAt` | String | Creation timestamp (ISO 8601) |
| `updatedAt` | String | Last update timestamp (ISO 8601) |

## 🔒 Security Best Practices

1. **Environment Variables:** Never commit `.env` file to Git
2. **IAM Roles:** Use IAM roles on EC2 instead of hardcoding credentials
3. **S3 Permissions:** Restrict bucket access to minimum required permissions
4. **Input Validation:** All inputs are validated on the server
5. **File Upload:** Only image files are allowed (JPEG, PNG, GIF, WebP)
6. **File Size:** Maximum 5MB per image

## 🚢 Deployment on EC2

### Prerequisites

- EC2 instance running Amazon Linux 2 or Ubuntu
- Security group allowing inbound traffic on port 3000 (or 80/443 with reverse proxy)

### Deployment Steps

1. **Connect to EC2 instance:**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js and npm:**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Clone or upload project:**
   ```bash
   git clone <your-repo> /home/ec2-user/app
   cd /home/ec2-user/app
   ```

4. **Install dependencies:**
   ```bash
   npm install --production
   ```

5. **Create `.env` file:**
   ```bash
   sudo nano .env
   ```

6. **Create IAM role and attach to EC2 instance**
   - DynamoDB: `AmazonDynamoDBFullAccess`
   - S3: `AmazonS3FullAccess`

7. **Start application with PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   pm2 start app.js --name "product-manager"
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx as reverse proxy (optional but recommended):**
   ```bash
   sudo yum install -y nginx
   sudo nano /etc/nginx/conf.d/product-app.conf
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name _;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Start Nginx:
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

## 🐛 Troubleshooting

### DynamoDB Connection Issues

```
Error: User: arn:aws:iam::... is not authorized to perform: dynamodb:...
```

**Solution:** Ensure IAM user/role has DynamoDB permissions

### S3 Upload Issues

```
Error uploading to S3: The bucket does not exist
```

**Solution:** Verify bucket name in `.env` and bucket exists in the correct region

### Module Not Found Errors

```
Error: Cannot find module '@aws-sdk/client-dynamodb'
```

**Solution:** Run `npm install` to install all dependencies

## 📝 Notes

- Remove hardcoded credentials before deploying to production
- Use Environment Variables or IAM Roles for AWS credentials
- Always validate and sanitize user input
- Implement rate limiting for production
- Consider adding authentication/authorization in future versions

## 📚 References

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [S3 User Guide](https://docs.aws.amazon.com/s3/)
- [EJS Documentation](https://ejs.co/)

## 📄 License

This project is provided for educational purposes.

## 👨‍💻 Author

Created as a mini project for learning Node.js, Express, DynamoDB, and AWS services.

---

**Happy Coding! 🎉**
