// app/api/gallery/route.js
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
const s3Client = new S3Client(awsConfig);

export async function GET(request) {
  try {
    // 1. Scan the entire table to get all items
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
    });
    const { Items } = await ddbDocClient.send(scanCommand);

    // 2. Group tags by imageUrl
    const imageMap = new Map();
    Items.forEach((item) => {
      if (!imageMap.has(item.imageUrl)) {
        imageMap.set(item.imageUrl, []);
      }
      imageMap.get(item.imageUrl).push(item.tag);
    });

    // 3. Create signed URLs and format the response
    const results = [];
    for (const [imageUrl, tags] of imageMap.entries()) {
      const key = imageUrl.split(".com/")[1];
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      results.push({ url: signedUrl, tags: tags });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}
