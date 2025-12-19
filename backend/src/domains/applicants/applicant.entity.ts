
import { Schema, model, Document, Types } from 'mongoose';

export interface IApplicant extends Document {
    userId: Types.ObjectId;
    sessionId: Types.ObjectId;
    actionType: string;
    itemId?: string;
    status?: string;
    timestamp: Date;
}

const applicantSchema = new Schema<IApplicant>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    actionType: { type: String, required: true },
    itemId: { type: String },
    status: { type: String, default: 'completed' },
    timestamp: { type: Date, default: Date.now },
});

// Indexes for faster lookups
applicantSchema.index({ timestamp: -1 });
applicantSchema.index({ actionType: 1, timestamp: -1 });
applicantSchema.index({ userId: 1, timestamp: -1 });
applicantSchema.index({ sessionId: 1, timestamp: -1 });

export default model<IApplicant>('Applicant', applicantSchema, 'applicants');
