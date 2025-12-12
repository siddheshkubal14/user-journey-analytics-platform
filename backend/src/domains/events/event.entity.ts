
import { Schema, model, Document, Types } from 'mongoose';

export interface IEvent extends Document {
    sessionId: Types.ObjectId;
    userId: Types.ObjectId;
    type: string; // page_view', 'purchase', 'click'
    page?: string; //  page URL or identifier
    itemId?: string; // item/product ID
    timestamp: Date;
    metadata?: Record<string, any>; // extra dynamic attributes
}

const eventSchema = new Schema<IEvent>({
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    page: { type: String },
    itemId: { type: String },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed },
});

export default model<IEvent>('Event', eventSchema, 'events');
