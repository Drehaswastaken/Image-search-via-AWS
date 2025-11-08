// app/api/search/route.js
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"; // <-- Import S3 tools
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // <-- Import S3 tools

// Configure AWS Clients
const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const ddbClient = new DynamoDBClient(awsConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client(awsConfig); // <-- Create an S3 client

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const queryCommand = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    KeyConditionExpression: "tag = :tag",
    ExpressionAttributeValues: {
      ":tag": query.toLowerCase(),
    },
  });

  try {
    // 1. Get image records from DynamoDB
    const { Items } = await ddbDocClient.send(queryCommand);

    // 2. Get unique image keys. We use the original S3 URL to find the key.
    const uniqueUrls = [...new Set(Items.map((item) => item.imageUrl))];
    const signedUrls = [];

    // 3. Create a signed "GET" URL for each unique image
    for (const url of uniqueUrls) {
      // Extract the object key from the full URL
      const key = url.split(".com/")[1];

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      // Create a temporary URL that expires in 1 hour (3600 seconds)
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      signedUrls.push(signedUrl);
    }

    // 4. Return the array of secure, temporary URLs
    return NextResponse.json(signedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching or signing images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}
