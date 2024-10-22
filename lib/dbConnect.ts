import mongoose from 'mongoose';

const connection = { isConnected: false };

async function dbConnect() {
  if (connection.isConnected) {
    return; // Se já está conectado, não faz nada
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error('A variável de ambiente MONGODB_URI não está definida.');
  }

  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = mongoose.connection.readyState === 1; // 1 significa conectado
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error; // Lance o erro para que você possa lidar com isso em outro lugar
  }
}

export default dbConnect;
