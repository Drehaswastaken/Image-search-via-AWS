# 🚀 AI-Powered Image Hub

This project is a cloud-native web application, similar to Google Photos, where users can upload images, have them automatically analyzed and tagged by AI, and then search for them using descriptive keywords.

This application is built with a modern, serverless stack using Next.js, AWS, and Vercel.

![]

---

## Core Features

* **🖼️ Secure Image Upload:** Upload images directly from the browser to a secure, private AWS S3 bucket.
* **🧠 Automatic AI Tagging:** Uploaded images are instantly analyzed by **AWS Rekognition** to generate descriptive tags (e.g., "dog," "beach," "car," "person").
* **⚡ Fast, Tag-Based Search:** A powerful search bar queries a **DynamoDB** (NoSQL) database to instantly find images matching your search tags.
* **🔒 Secure Image Access:** Image URLs are temporary and securely signed. Your S3 bucket remains **fully private**.
* **✨ Sleek, Dark-Mode UI:** A responsive and modern user interface built with Next.js.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Deployment:** [Vercel](https://vercel.com/)
* **Image Storage:** [AWS S3](https://aws.amazon.com/s3/)
* **Database:** [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (NoSQL)
* **AI Tagging:** [AWS Rekognition](https://aws.amazon.com/rekognition/)
* **Security:** [AWS IAM](https://aws.amazon.com/iam/)

---

## 🔧 Getting Started (Local Setup)

To run this project on your local machine, follow these steps.

### Prerequisites

* Node.js (v18 or later)
* An AWS Account

### 1. Configure Your AWS Services

1.  **IAM (Identity and Access Management):**
    * Create a new IAM User with "Programmatic access."
    * Attach the following policies: `AmazonS3FullAccess`, `AmazonRekognitionFullAccess`, `AmazonDynamoDBFullAccess`.
    * Save the generated **Access Key ID** and **Secret Access Key**.

2.  **S3 (Simple Storage Service):**
    * Create a new private S3 Bucket (e.g., `my-image-app-bucket`).
    * Note the **Region** (e.g., `ap-south-1`).
    * Go to the "Permissions" tab and add this **CORS** policy:
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

3.  **DynamoDB (Database):**
    * Create a new table (e.g., `image-search`).
    * Set the **Partition key** to `tag` (Type: String).
    * Check "Add sort key" and set the **Sort key** to `imageUrl` (Type: String).

### 2. Set Up The Project

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    * Create a file named `.env.local` in the root of the project.
    * Copy and paste your AWS credentials into it:

    ```env
    # .env.local
    AWS_ACCESS_KEY_ID=YOUR_IAM_ACCESS_KEY
    AWS_SECRET_ACCESS_KEY=YOUR_IAM_SECRET_KEY
    AWS_REGION=your-s3-bucket-region
    S3_BUCKET_NAME=your-s3-bucket-name
    DYNAMODB_TABLE_NAME=your-dynamodb-table-name
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

---

## 🚀 Deployment

This project is configured for seamless deployment on [Vercel](https://vercel.com/).

1.  **Push to GitHub:** Push your project to a GitHub repository.
2.  **Import to Vercel:** On your Vercel dashboard, import the repository.
3.  **Add Environment Variables:** In the Vercel project settings, add the 5 environment variables from your `.env.local` file.
4.  **Update S3 CORS:** **This is critical.** You must add your Vercel app's URL (e.g., `https://my-app.vercel.app`) to your S3 bucket's CORS policy in AWS.

    ```json
    "AllowedOrigins": [
      "http://localhost:3000",
      "[https://image-search-via-aws.vercel.app](https://image-search-via-aws.vercel.app)" 
    ],
    ```
5.  **Deploy!** Vercel will build and deploy your app, making it live on the web.
