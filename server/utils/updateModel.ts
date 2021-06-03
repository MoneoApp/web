import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: 'moneo-f4b14',
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.CLIENT_x509_CERT_URL
    } as any),
    storageBucket: 'gs://moneo-f4b14.appspot.com'
  });
}

const storageBucket = admin.storage().bucket();
const ml = admin.machineLearning();

export async function updateModel(modelId: string, tflite: string) {
  console.log('Updating existing model in Cloud Storage...');

  const model = await ml.getModel(modelId);
  const files = await storageBucket.upload(tflite);

  const bucket = files[0].metadata.bucket;
  const name = files[0].metadata.name;

  await ml.updateModel(model.modelId, {
    tfliteModel: {
      gcsTfliteUri: `gs://${bucket}/${name}`
    }
  });

  console.log('Model updated:');
  console.log(`${model.displayName}\t${model.modelId}`);
}
