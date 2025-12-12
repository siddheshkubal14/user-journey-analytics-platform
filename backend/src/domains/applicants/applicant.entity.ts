
import { Schema, model, Document, Types } from 'mongoose';

export interface IApplicant extends Document {
    userId: Types.ObjectId;
    sessionId: Types.ObjectId;
    actionType: string; // 'purchase', 'add_to_cart', 'wishlist', etc.
    itemId?: string; // item/product reference
    status?: string; // 'completed', 'pending', etc.
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

export default model<IApplicant>('Applicant', applicantSchema, 'applicants');
