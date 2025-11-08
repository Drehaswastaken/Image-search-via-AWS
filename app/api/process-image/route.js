// app/api/process-image/route.js
import { NextResponse } from "next/server";
import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

// Configure AWS Clients
const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const rekognitionClient = new RekognitionClient(awsConfig);
const ddbClient = new DynamoDBClient(awsConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export async function POST(request) {
  try {
    const { key } = await request.json();
    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    // 1. Analyze image with AWS Rekognition
    const detectLabelsCommand = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: process.env.S3_BUCKET_NAME,
          Name: key,
        },
      },
      MaxLabels: 10,
      MinConfidence: 80,
    });

    const { Labels } = await rekognitionClient.send(detectLabelsCommand);

    // 2. Prepare items for DynamoDB
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    const tags = Labels.map((label) => label.Name.toLowerCase());

    if (tags.length === 0) {
      return NextResponse.json(
        { success: true, message: "No labels detected" },
        { status: 200 }
      );
    }

    // We must write one item for each tag
    const putRequests = tags.map((tag) => ({
      PutRequest: {
        Item: {
          tag: tag, // Partition Key
          imageUrl: imageUrl, // Sort Key
        },
      },
    }));

    // 3. Save items to DynamoDB in a batch
    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: {
        [process.env.DYNAMODB_TABLE_NAME]: putRequests,
      },
    });

    await ddbDocClient.send(batchWriteCommand);

    return NextResponse.json({ success: true, tags: tags }, { status: 200 });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 }
    );
  }
}
