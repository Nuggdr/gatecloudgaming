// models/Machine.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMachine extends Document {
  ip: string;
  username: string;
  password: string;
  assigned: boolean;
}

const MachineSchema: Schema = new Schema({
  ip: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  assigned: { type: Boolean, default: false },
});

// Verifica se o modelo já foi definido para evitar OverwriteModelError
const Machine = mongoose.models.Machine || mongoose.model<IMachine>('Machine', MachineSchema);

export default Machine;
