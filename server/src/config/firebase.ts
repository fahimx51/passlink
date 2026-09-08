import 'dotenv/config';
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace escaped \n strings so Firebase Admin reads multiline keys correctly
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

export const bucket = getStorage().bucket();


async function configureBucketCors() {
    try {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

        await bucket.setCorsConfiguration([
            {
                origin: [clientUrl], // Your React / Next.js frontend origins
                method: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                responseHeader: ["Content-Type", "x-goog-resumable"],
                maxAgeSeconds: 3600,
            },
        ]);
        console.log("Firebase Storage CORS configured successfully.");
    } catch (error) {
        console.error("Error setting Firebase Storage CORS:", error);
    }
}

configureBucketCors();