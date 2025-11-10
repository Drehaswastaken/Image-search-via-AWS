// app/api/search/route.js
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"; // QueryCommand
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
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Find all images with the search tag (using the base table)
    const queryCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: "tag = :tag",
      ExpressionAttributeValues: { ":tag": query.toLowerCase() },
    });

    const { Items: searchResultItems } = await ddbDocClient.send(queryCommand);
    const uniqueImageUrls = [
      ...new Set(searchResultItems.map((item) => item.imageUrl)),
    ];

    // 2. For each unique image, find ALL its tags (using the new GSI)
    const results = [];
    for (const imageUrl of uniqueImageUrls) {
      // 2a. Find all tags for this image using the GSI
      const gsiQueryCommand = new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: "imageUrl-index", // Use our new GSI
        KeyConditionExpression: "imageUrl = :imageUrl",
        ExpressionAttributeValues: { ":imageUrl": imageUrl },
      });

      const { Items: tagItems } = await ddbDocClient.send(gsiQueryCommand);
      const tags = tagItems.map((item) => item.tag);

      // 2b. Get the signed URL for viewing
      const key = imageUrl.split(".com/")[1];
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 3600,
      });

      // 2c. Add to results
      results.push({ url: signedUrl, tags: tags });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching or signing images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}
