import { Schema, model, Document } from 'mongoose';

export interface IAnalyticsExport extends Document {
    date: string;
    kpis: {
        date: string;
        pageVisits: number;
        purchaseCount: number;
        addToCartCount: number;
        activeSessions: number;
    };
    conversion: {
        cartToPageViewRatio: number;
        conversionRate: number;
    };
    source: string;
    exportedAt: Date;
    externalExportStatus?: {
        attempted: boolean;
        success: boolean;
        statusCode?: number;
        message?: string;
    };
}

const analyticsExportSchema = new Schema<IAnalyticsExport>({
    date: { type: String, required: true, unique: true },
    kpis: {
        date: { type: String, required: true },
        pageVisits: { type: Number, default: 0 },
        purchaseCount: { type: Number, default: 0 },
        addToCartCount: { type: Number, default: 0 },
        activeSessions: { type: Number, default: 0 },
    },
    conversion: {
        cartToPageViewRatio: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
    },
    source: { type: String, default: 'user-journey-analytics-backend' },
    exportedAt: { type: Date, default: Date.now },
    externalExportStatus: {
        attempted: { type: Boolean, default: false },
        success: { type: Boolean, default: false },
        statusCode: { type: Number },
        message: { type: String },
    },
});

// Index for efficient querying by date
analyticsExportSchema.index({ date: -1 });
analyticsExportSchema.index({ exportedAt: -1 });

export default model<IAnalyticsExport>('AnalyticsExport', analyticsExportSchema, 'analytics_exports');
