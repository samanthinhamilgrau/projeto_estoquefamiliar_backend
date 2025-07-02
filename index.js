const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // <- MUITO IMPORTANTE
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  })
});

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const movimentosCollection = db.collection('movimentos');

// POST movimento
app.post('/movimento', async (req, res) => {
  const { produto, quantidade, tipo, data, nome } = req.body;

  try {
    await movimentosCollection.add({
      produto,
      quantidade,
      tipo,
      data,
      nome
    });

    console.log('Movimento registrado no Firestore:', { produto, quantidade, tipo, data, nome });
    res.status(200).json({ message: 'Movimento registrado com sucesso!' });

  } catch (error) {
    console.error('Erro ao registrar movimento:', error);
    res.status(500).json({ error: 'Erro ao registrar movimento.' });
  }
});

// GET movimentos
app.get('/movimentos', async (req, res) => {
  try {
    const snapshot = await movimentosCollection.get();
    const movimentos = snapshot.docs.map(doc => doc.data());
    res.json(movimentos);
  } catch (error) {
    console.error('Erro ao buscar movimentos:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

