# 🚀 Pictura.AI — AI-Powered Image Hub

🌐 **Live Demo:** [https://pictura-ai-aws.vercel.app/](https://pictura-ai-aws.vercel.app/)

**Pictura.AI** is a **cloud-native, AI-driven image management web app** — think of it as a smarter version of Google Photos.  
Users can upload images, have them **automatically analyzed and tagged by AI**, and **search** using natural, descriptive keywords.

This project leverages a **modern serverless stack** powered by **Next.js**, **AWS**, and **Vercel**.

---

## 🌟 Core Features

- **🖼️ Secure Image Upload** — Upload images directly from your browser to a **private AWS S3 bucket**.
- **🧠 Automatic AI Tagging** — Every uploaded image is analyzed using **AWS Rekognition**, generating descriptive tags like `"dog"`, `"beach"`, `"car"`, or `"person"`.
- **⚡ Instant, Tag-Based Search** — Search for images effortlessly through tags stored in **AWS DynamoDB**.
- **🔒 Secure Image Access** — Images are accessible only via **temporary signed URLs**, keeping your data fully private.
- **✨ Sleek Dark-Mode UI** — A beautiful, modern, and responsive interface built with **Next.js** and deployed on **Vercel**.

---

## 🛠️ Tech Stack

| Component         | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| **Frontend**      | [Next.js](https://nextjs.org/)                         |
| **Deployment**    | [Vercel](https://vercel.com/)                          |
| **Image Storage** | [AWS S3](https://aws.amazon.com/s3/)                   |
| **Database**      | [AWS DynamoDB](https://aws.amazon.com/dynamodb/)       |
| **AI Tagging**    | [AWS Rekognition](https://aws.amazon.com/rekognition/) |
| **Security**      | [AWS IAM](https://aws.amazon.com/iam/)                 |

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites

- Node.js (v18 or later)
- An AWS Account

---

### 1. Configure AWS Services

#### 🧑‍💻 IAM (Identity and Access Management)

1. Create a new **IAM User** with **Programmatic Access**.
2. Attach the following policies:
   - `AmazonS3FullAccess`
   - `AmazonRekognitionFullAccess`
   - `AmazonDynamoDBFullAccess`
3. Save the generated **Access Key ID** and **Secret Access Key**.

---

#### ☁️ S3 (Simple Storage Service)

1. Create a **private S3 Bucket** (e.g., `pictura-ai-bucket`).
2. Note your **Region** (e.g., `ap-south-1`).
3. Under **Permissions → CORS Configuration**, paste the following:

   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["PUT", "POST", "GET"],
       "AllowedOrigins": ["http://localhost:3000"],
       "ExposeHeaders": []
     }
   ]
   ```
