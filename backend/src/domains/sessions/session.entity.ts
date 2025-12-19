
import { Schema, model, Document, Types } from 'mongoose';

export interface ISession extends Document {
    userId: Types.ObjectId;
    sessionStart: Date;
    sessionEnd?: Date;
    pagesVisited: number;
    timeSpent: number; // in seconds
    createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionStart: { type: Date, required: true, default: Date.now },
    sessionEnd: { type: Date },
    pagesVisited: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});


sessionSchema.index({ sessionStart: -1 });
sessionSchema.index({ userId: 1, sessionStart: -1 });

export default model<ISession>('Session', sessionSchema, 'sessions');
