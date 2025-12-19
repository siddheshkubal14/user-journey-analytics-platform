
import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
    sessionId?: Types.ObjectId;
    userId: Types.ObjectId;
    type: string;
    page?: string;
    itemId?: string;
    duration?: number;
    purchaseCount?: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}

const eventSchema = new Schema<IEvent>({
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    page: { type: String },
    itemId: { type: String },
    duration: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed },
});

// Indexes for faster lookups
eventSchema.index({ timestamp: -1 });
eventSchema.index({ type: 1, timestamp: -1 });
eventSchema.index({ userId: 1, timestamp: -1 });
eventSchema.index({ sessionId: 1, timestamp: -1 });

export default model<IEvent>('Event', eventSchema, 'events');
