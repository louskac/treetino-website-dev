/**
 * Vercel Serverless Function: /api/pws
 * Fetches live & historical telemetry for a Weather Underground Personal Weather Station (PWS).
 * Automatically refreshes the Weather.com public API key from Wunderground if rotated.
 */

const DEFAULT_API_KEY = 'f6d2efe5720d47ea92efe5720df7eaa8';
const BASE_URL = 'https://api.weather.com';

let cachedApiKey = process.env.WUNDERGROUND_API_KEY || DEFAULT_API_KEY;

async function resolveFreshApiKey(stationId) {
    try {
        const res = await fetch(`https://www.wunderground.com/dashboard/pws/${encodeURIComponent(stationId)}`, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            },
        });
        const html = await res.text();
        const match = html.match(/"API_KEY"\s*:\s*"([a-f0-9]{32})"/i);
        if (match && match[1]) {
            cachedApiKey = match[1];
            return cachedApiKey;
        }
    } catch {
        // fallback to default
    }
    return cachedApiKey;
}

async function fetchJson(url) {
    const res = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });
    if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json();
}

function formatYmd(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const stationId = String(req.query?.stationId || 'IPRAGU1761')
        .trim()
        .toUpperCase();
    const dateParam = req.query?.date ? String(req.query.date).replace(/[^0-9]/g, '') : null;

    if (!/^[A-Z0-9_-]{4,24}$/.test(stationId)) {
        return res.status(400).json({ error: 'Invalid stationId parameter.' });
    }

    const runWithKey = async (apiKey) => {
        const now = new Date();
        const endYmd = formatYmd(now);
        const m1Start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const m2Start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
        const m2End = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
        const m3Start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1));
        const m3End = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 0));

        const q = `stationId=${encodeURIComponent(stationId)}&format=json&units=m&numericPrecision=decimal&apiKey=${apiKey}`;

        // Test current or identity first to verify API key
        const identity = await fetchJson(
            `${BASE_URL}/v2/pwsidentity?stationId=${encodeURIComponent(stationId)}&format=json&units=m&apiKey=${apiKey}`,
        );

        const [current, intraday, hourly7d, daily7d, histM1, histM2, histM3, specificDay] = await Promise.all([
            fetchJson(`${BASE_URL}/v2/pws/observations/current?${q}`).catch(() => ({ observations: [] })),
            fetchJson(`${BASE_URL}/v2/pws/observations/all/1day?${q}`).catch(() => ({ observations: [] })),
            fetchJson(`${BASE_URL}/v2/pws/observations/hourly/7day?${q}`).catch(() => ({ observations: [] })),
            fetchJson(`${BASE_URL}/v2/pws/dailysummary/7day?${q}`).catch(() => ({ summaries: [] })),
            fetchJson(
                `${BASE_URL}/v2/pws/history/daily?${q}&startDate=${formatYmd(m1Start)}&endDate=${endYmd}`,
            ).catch(() => ({ observations: [] })),
            fetchJson(
                `${BASE_URL}/v2/pws/history/daily?${q}&startDate=${formatYmd(m2Start)}&endDate=${formatYmd(m2End)}`,
            ).catch(() => ({ observations: [] })),
            fetchJson(
                `${BASE_URL}/v2/pws/history/daily?${q}&startDate=${formatYmd(m3Start)}&endDate=${formatYmd(m3End)}`,
            ).catch(() => ({ observations: [] })),
            dateParam
                ? fetchJson(`${BASE_URL}/v2/pws/history/all?${q}&date=${dateParam}`).catch(() => ({
                      observations: [],
                  }))
                : Promise.resolve(null),
        ]);

        const byEpoch = new Map();
        for (const item of [
            ...(histM3.observations || []),
            ...(histM2.observations || []),
            ...(histM1.observations || []),
            ...(daily7d.summaries || []),
        ]) {
            if (item && item.obsTimeLocal) {
                const dayKey = item.obsTimeLocal.slice(0, 10);
                byEpoch.set(dayKey, item);
            }
        }

        const dailyHistory = Array.from(byEpoch.values()).sort((a, b) => (a.epoch || 0) - (b.epoch || 0));

        return {
            stationId,
            fetchedAt: new Date().toISOString(),
            identity,
            current: current.observations?.[0] || null,
            intraday: intraday.observations || [],
            hourly7d: hourly7d.observations || [],
            daily7d: daily7d.summaries || [],
            dailyHistory,
            specificDay: specificDay?.observations || null,
        };
    };

    try {
        let payload;
        try {
            payload = await runWithKey(cachedApiKey);
        } catch (err) {
            if (err.status === 401 || err.status === 403) {
                const newKey = await resolveFreshApiKey(stationId);
                payload = await runWithKey(newKey);
            } else {
                throw err;
            }
        }
        return res.status(200).json(payload);
    } catch (error) {
        return res.status(502).json({
            error: 'Failed to retrieve PWS telemetry from Weather Underground upstream.',
            message: error?.message || 'Upstream error',
            stationId,
        });
    }
}
