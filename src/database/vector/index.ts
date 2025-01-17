"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { UpsertRequest } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import {
  computeDistanceHaversine,
  serverLocations,
} from "@/util/vector/compute-distance-haversine";

export async function initializePinecone() {
  const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is undefined!");
  }
  return new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
}

async function getDeviceLocationInformation() {
  const response = await fetch("https://ipinfo.io/json")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching IP address:", error);
    });
  return response;
}

export async function getRegion() {
  const information = await getDeviceLocationInformation();
  const [userLatitude, userLongitude] = information.loc.split(",").map(Number);

  let closestServerRegion = "us-east-1";
  let closestServerCloud = "aws";
  let shortestDistance = Infinity;

  for (const { region, latitude, longitude, cloud } of serverLocations) {
    const distance = computeDistanceHaversine(
      userLatitude,
      userLongitude,
      latitude,
      longitude,
    );
    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestServerRegion = region;
      closestServerCloud = cloud;
    }
  }

  return {
    region: closestServerRegion,
    cloud: closestServerCloud,
  };
}

// Change serverless.cloud to the right cloud provider
export async function getIndex(pinecone: Pinecone, indexName: string) {
  const existingIndexes = await pinecone.listIndexes();
  const isIndexPresent = existingIndexes.indexes?.some(
    (index) => index.name === indexName,
  );
  if (isIndexPresent) {
    return pinecone.Index(indexName);
  }

  const { region, cloud } = await getRegion();
  console.log("region", region);
  console.log("cloud", cloud);
  const dimension = 1536;

  console.log("name", indexName);
  console.log("lubweröouwberöweröwir hello test");
  await pinecone.createIndex({
    name: indexName,
    dimension: dimension,
    spec: {
      serverless: {
        cloud: cloud as "aws" | "gcp" | "azure",
        region: region,
      },
    },
  });

  let status = await pinecone.describeIndex(indexName);
  while (!status.status.ready) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    status = await pinecone.describeIndex(indexName);
  }

  return pinecone.Index(indexName);
}

// NOTE: namespace very important to differentiate between different files
export async function upsertEmbedding(
  index: any,
  chunks: string[],
  embeddings: number[][],
  file_id: string,
  namespace: string = "",
) {
  if (chunks.length !== embeddings.length) {
    throw new Error("Chunks and embedding length mismatch");
  }

  const vectors = chunks.map((chunk, i) => ({
    id: `chunk-${i}`,
    values: embeddings[i],
    metadata: {
      file_id: file_id,
      text: chunk,
    },
  }));

  const upsertRequest: UpsertRequest = {
    vectors: vectors,
    namespace: namespace,
  };

  try {
    const response = await index.upsert(upsertRequest);
    console.log(`Upserted ${vectors.length} vectors to Pinecone.`);
  } catch (error) {
    console.error(`Error upserting vectors to Pinecone ${error}`);
    throw error;
  }
}
