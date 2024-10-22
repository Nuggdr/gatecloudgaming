import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    plan: { type: String, required: false }, // Adicione este campo se ainda não existir
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
