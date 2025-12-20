import { AnalyticsService } from '../domains/analytics/analytics.service';
import { logger } from '../shared/utils/logger.util';
import { URL } from 'url';
import https from 'https';

export interface ExportResult {
    success: boolean;
    statusCode?: number;
    message?: string;
}

const postJson = (targetUrl: string, body: any, headers: Record<string, string> = {}): Promise<ExportResult> => {
    return new Promise((resolve) => {
        try {
            const url = new URL(targetUrl);
            const data = Buffer.from(JSON.stringify(body));

            const req = https.request(
                {
                    hostname: url.hostname,
                    path: url.pathname + (url.search || ''),
                    port: url.port || 443,
                    method: 'POST',
                    protocol: url.protocol,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length,
                        ...headers,
                    },
                },
                (res) => {
                    const chunks: Buffer[] = [];
                    res.on('data', (c) => chunks.push(Buffer.from(c)));
                    res.on('end', () => {
                        const responseText = Buffer.concat(chunks).toString('utf8');
                        resolve({ success: res.statusCode! >= 200 && res.statusCode! < 300, statusCode: res.statusCode, message: responseText });
                    });
                }
            );

            req.on('error', (err) => {
                logger.error('Export HTTP error', { message: err.message });
                resolve({ success: false, message: err.message });
            });

            req.write(data);
            req.end();
        } catch (err: any) {
            logger.error('Export request build error', { message: err.message });
            resolve({ success: false, message: err.message });
        }
    });
};

const getYesterdayDateString = (): string => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const exportDailyAnalytics = async (): Promise<ExportResult> => {
    const targetUrl = process.env.EXPORT_TARGET_URL;
    const apiKey = process.env.EXPORT_TARGET_API_KEY;

    if (!targetUrl) {
        logger.warn('EXPORT_TARGET_URL not set; skipping export');
        return { success: false, message: 'Missing EXPORT_TARGET_URL' };
    }

    try {
        const [dailyKpis, conversion] = await Promise.all([
            AnalyticsService.getDailyKPIs(),
            AnalyticsService.getConversionMetrics(),
        ]);

        const date = getYesterdayDateString();
        const kpiForDay = dailyKpis.find((k) => k.date === date) || dailyKpis[0];

        const payload = {
            date,
            kpis: kpiForDay || { date, pageVisits: 0, purchaseCount: 0, addToCartCount: 0, activeSessions: 0 },
            conversion,
            source: 'user-journey-analytics-backend',
            exportedAt: new Date().toISOString(),
        };

        const headers: Record<string, string> = {};
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        logger.info('Exporting daily analytics', { targetUrl, date });
        const result = await postJson(targetUrl, payload, headers);

        if (result.success) {
            logger.info('Daily analytics export successful', { statusCode: result.statusCode });
        } else {
            logger.error('Daily analytics export failed', { statusCode: result.statusCode, message: result.message });
        }

        return result;
    } catch (err: any) {
        logger.error('Daily analytics export exception', { message: err.message });
        return { success: false, message: err.message };
    }
};
