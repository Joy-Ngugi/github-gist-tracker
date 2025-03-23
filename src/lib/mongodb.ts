// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI as string;
// const options = {};

// // Ensure MongoDB URI is provided
// if (!uri) {
//   throw new Error("Please add your MongoDB URI to .env.local");
// }

// // ✅ Correctly extend globalThis
// declare global {
//   /* eslint-disable no-var */
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
//   /* eslint-enable no-var */
// }

// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   if (!globalThis._mongoClientPromise) {
//     const client = new MongoClient(uri, options);
//     globalThis._mongoClientPromise = client.connect();
//   }
//   clientPromise = globalThis._mongoClientPromise;
// } else {
//   const client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
export default client.connect();








