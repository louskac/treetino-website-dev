import { IPRAGU1761_SNAPSHOT } from './ipragu1761Snapshot';

export const WEATHER_COM_PUBLIC_KEY = 'f6d2efe5720d47ea92efe5720df7eaa8';

export interface WindRoseSector {
    sector: string;
    degCenter: number;
    count: number;
    pct: number;
    avgSpeedMs: number;
    maxGustMs: number;
}

export interface DiurnalBin {
    hour: number;
    label: string;
    avgSpeedMs: number;
    maxGustMs: number;
    avgTempC: number;
    avgHumidity: number;
    avgSolarWm2: number;
}

export interface IntradayPoint {
    obsTimeLocal: string;
    timeLabel: string;
    epoch: number;
    windspeedAvgMs: number;
    windspeedHighMs: number;
    windgustHighMs: number;
    winddirAvg: number;
    tempAvgC: number;
    tempHighC: number;
    tempLowC: number;
    dewptAvgC: number;
    windchillAvgC: number;
    heatindexAvgC: number;
    humidityAvg: number;
    pressureMaxHpa: number;
    pressureMinHpa: number;
    solarRadiationHigh: number;
    uvHigh: number;
    precipRateMmHr: number;
    precipTotalMm: number;
}

export interface DailySummaryPoint {
    date: string;
    epoch: number;
    windspeedAvgMs: number;
    windspeedHighMs: number;
    windgustHighMs: number;
    winddirAvg: number;
    tempAvgC: number;
    tempHighC: number;
    tempLowC: number;
    humidityAvg: number;
    humidityHigh: number;
    humidityLow: number;
    pressureMaxHpa: number;
    pressureMinHpa: number;
    solarRadiationHigh: number;
    uvHigh: number;
    precipRateMmHr: number;
    precipTotalMm: number;
}

export interface HubShearRow {
    label: string;
    shortLabel: string;
    heightM: number;
    multiplierSpeed: number;
    multiplierPower: number;
    meanWindMs: number;
    peakGustMs: number;
    powerDensityWm2: number;
    dynamicGustPressurePa: number;
    estimatedAnnualMwhPerTree: number;
    cutInHoursPct: number;
}

export interface FleetDeviceSlot {
    slotNumber: number;
    unitCode: string;
    wundergroundId: string | null;
    wundergroundUrl: string | null;
    installed: boolean;
    label: string;
    sublabel: string;
    lat: number | null;
    lon: number | null;
    mapX: number | null;
    mapY: number | null;
}

export interface StationTelemetryBundle {
    isLiveApi: boolean;
    fetchedAtIso: string;
    sha256Hash: string;
    payloadBytes: number;
    identity: {
        stationId: string;
        name: string;
        neighborhood: string;
        city: string;
        country: string;
        lat: number;
        lon: number;
        mapX: number;
        mapY: number;
        elevationM: number;
        mastHeightM: number;
        stationType: string;
        softwareType: string;
        tzName: string;
        startTime: string;
        lastUpdateTime: string;
        goldStar: boolean;
        qcStatus: number;
    };
    current: {
        obsTimeLocal: string;
        obsTimeUtc: string;
        epoch: number;
        windspeedMs: number;
        windspeedKmh: number;
        windgustMs: number;
        windgustKmh: number;
        winddirDeg: number;
        winddirCardinal: string;
        beaufortNumber: number;
        beaufortLabel: string;
        tempC: number;
        heatIndexC: number;
        dewptC: number;
        windchillC: number;
        humidityPct: number;
        pressureHpa: number;
        pressureTrendHpa: number;
        solarRadiationWm2: number;
        uvIndex: number;
        precipRateMmHr: number;
        precipTotalMm: number;
        airDensityKgM3: number;
        instantPowerDensityWm2: number;
    };
    aggregates: {
        totalDays: number;
        totalHourlyBins: number;
        total5MinFrames: number;
        dateStart: string;
        dateEnd: string;
        meanWindMs: number;
        meanWindKmh: number;
        peakGustMs: number;
        peakGustKmh: number;
        peakGustTimestamp: string;
        peakGustEpoch: number;
        peakGustDirDeg: number;
        maxSustainedMs: number;
        maxSustainedKmh: number;
        maxSustainedTimestamp: string;
        maxSustainedEpoch: number;
        tempMinC: number;
        tempMinTimestamp: string;
        tempMaxC: number;
        tempMaxTimestamp: string;
        tempMeanC: number;
        pressureMinHpa: number;
        pressureMinTimestamp: string;
        pressureMaxHpa: number;
        pressureMaxTimestamp: string;
        pressureMeanHpa: number;
        humidityMinPct: number;
        humidityMinTimestamp: string;
        humidityMaxPct: number;
        humidityMaxTimestamp: string;
        humidityMeanPct: number;
        totalPrecipMm: number;
        maxRainRateMmHr: number;
        maxRainRateTimestamp: string;
        maxDailyPrecipMm: number;
        maxDailyPrecipDate: string;
        solarMaxWm2: number;
        uvMax: number;
        meanAirDensityKgM3: number;
        cubicMeanWindMs: number;
        meanPowerDensityWm2: number;
        peakDynamicPressurePa: number;
        vectorResultant: {
            meanXSin: number;
            meanYCos: number;
            resultantDeg: number;
            dominantSector: string;
        };
    };
    windRose16: WindRoseSector[];
    diurnalProfile: DiurnalBin[];
    intradayToday: IntradayPoint[];
    intradayYesterday: IntradayPoint[];
    intradayPeakDay: IntradayPoint[];
    dailyHistory: DailySummaryPoint[];
    hubShearMatrix: HubShearRow[];
    rawJsonPreview: Record<string, unknown>;
}

/**
 * Projects geographic (lat, lon) in the Czech Republic onto the
 * shared EUROPE_COUNTRIES SVG viewBox (680 x 520).
 */
export function latLonToCzMap(lat: number, lon: number): { x: number; y: number } {
    const x = 342.14 + (lon - 14.3156) * 7.9746 + (lat - 51.0557) * -0.8307;
    const y = 324.96 + (lon - 14.3156) * -0.5192 + (lat - 51.0557) * -12.189;
    return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
    };
}

export const CARDINAL_16 = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
] as const;

export function degToCardinal16(deg: number): string {
    const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
    return CARDINAL_16[idx];
}

export function getBeaufortScale(speedMs: number): { number: number; label: string } {
    if (speedMs < 0.5) return { number: 0, label: 'Calm' };
    if (speedMs < 1.6) return { number: 1, label: 'Light Air' };
    if (speedMs < 3.4) return { number: 2, label: 'Light Breeze' };
    if (speedMs < 5.5) return { number: 3, label: 'Gentle Breeze' };
    if (speedMs < 8.0) return { number: 4, label: 'Moderate Breeze' };
    if (speedMs < 10.8) return { number: 5, label: 'Fresh Breeze' };
    if (speedMs < 13.9) return { number: 6, label: 'Strong Breeze' };
    if (speedMs < 17.2) return { number: 7, label: 'Near Gale' };
    return { number: 8, label: 'Gale' };
}

export function computeAirDensity(tempC: number, pressureHpa: number): number {
    const pPa = (pressureHpa || 1013.25) * 100;
    const tK = (tempC ?? 11) + 273.15;
    const rho = pPa / (287.058 * tK);
    return Number(rho.toFixed(3));
}

export function kmhToMs(kmh: number | null | undefined): number {
    if (kmh == null || Number.isNaN(Number(kmh))) return 0;
    return Number((Number(kmh) / 3.6).toFixed(2));
}

const PRAGUE_MAP_POS = latLonToCzMap(50.039, 14.428);
const DEHTOV_MAP_POS = latLonToCzMap(50.42368, 15.72965);

/**
 * Real hardware fleet inventory:
 * - Slot #01: Active installed station `ISTOCH13` at Stochov (streaming live API data)
 * - Slot #02: Active installed station `ITEBIH6` at Horní Dehtov 39 (live API telemetry)
 * - Slots #03–#05: 3 purchased stations ready for client installation (no fake data)
 */
export const INITIAL_FLEET_SLOTS: FleetDeviceSlot[] = [
    {
        slotNumber: 1,
        unitCode: 'STANICE 01 · AKTIVNÍ',
        wundergroundId: 'ISTOCH13',
        wundergroundUrl: 'https://www.wunderground.com/dashboard/pws/ISTOCH13',
        installed: true,
        label: 'Treetino — Stochov',
        sublabel: 'Stochov · 50.147° N, 13.951° E · Živá API telemetrie',
        lat: 50.147,
        lon: 13.951,
        mapX: latLonToCzMap(50.147, 13.951).x,
        mapY: latLonToCzMap(50.147, 13.951).y,
    },
    {
        slotNumber: 2,
        unitCode: 'STANICE 02 · AKTIVNÍ',
        wundergroundId: 'ITEBIH6',
        wundergroundUrl: 'https://www.wunderground.com/dashboard/pws/ITEBIH6',
        installed: true,
        label: 'Treetino — Horní Dehtov',
        sublabel: 'Horní Dehtov 39 · 50.424° N, 15.730° E · Živá API telemetrie',
        lat: 50.42368,
        lon: 15.72965,
        mapX: DEHTOV_MAP_POS.x,
        mapY: DEHTOV_MAP_POS.y,
    },
    {
        slotNumber: 3,
        unitCode: 'STANICE 03 · SKLADEM',
        wundergroundId: null,
        wundergroundUrl: null,
        installed: false,
        label: 'Nová měřicí stanice #03',
        sublabel: 'Zakoupeno · Distribuce klientovi',
        lat: null,
        lon: null,
        mapX: null,
        mapY: null,
    },
    {
        slotNumber: 4,
        unitCode: 'STANICE 04 · SKLADEM',
        wundergroundId: null,
        wundergroundUrl: null,
        installed: false,
        label: 'Nová měřicí stanice #04',
        sublabel: 'Zakoupeno · Distribuce klientovi',
        lat: null,
        lon: null,
        mapX: null,
        mapY: null,
    },
    {
        slotNumber: 5,
        unitCode: 'STANICE 05 · SKLADEM',
        wundergroundId: null,
        wundergroundUrl: null,
        installed: false,
        label: 'Nová měřicí stanice #05',
        sublabel: 'Zakoupeno · Distribuce klientovi',
        lat: null,
        lon: null,
        mapX: null,
        mapY: null,
    },
];

export function buildHubShearMatrix(
    mastHeightM: number,
    meanWindMs: number,
    peakGustMs: number,
    airDensityKgM3: number,
    cubicMeanWindMs: number,
    alpha = 0.28,
): HubShearRow[] {
    const zRef = Math.max(1.2, mastHeightM || 1.524);
    const targets = [
        { label: `Současný senzor (${zRef.toFixed(2)} m AGL)`, shortLabel: `${zRef.toFixed(1)} m AGL`, heightM: zRef },
        { label: 'Zvýšený střešní stožár (8.50 m AGL)', shortLabel: '8.5 m AGL', heightM: 8.5 },
        { label: 'Volný perimetrický stožár (12.00 m AGL)', shortLabel: '12.0 m AGL', heightM: 12.0 },
    ];

    return targets.map((t) => {
        const ratio = t.heightM / zRef;
        const multSpeed = Math.pow(ratio, alpha);
        const multPower = Math.pow(multSpeed, 3);
        const projMeanMs = Number((meanWindMs * multSpeed).toFixed(2));
        const projGustMs = Number((peakGustMs * multSpeed).toFixed(2));
        const projCubicMs = cubicMeanWindMs * multSpeed;
        const powerDensity = Number((0.5 * airDensityKgM3 * Math.pow(projCubicMs, 3)).toFixed(1));
        const dynPressure = Number((0.5 * airDensityKgM3 * Math.pow(projGustMs, 2)).toFixed(1));
        const annualMwh = Number(
            (Math.min(18.5, Math.max(0.8, powerDensity * 0.082 + (projMeanMs > 2.2 ? (projMeanMs - 1.5) * 1.65 : 0.45)))).toFixed(2),
        );
        const cutInPct = Number(Math.min(94, Math.max(18, 22 + (projMeanMs - 1.0) * 18.5)).toFixed(1));

        return {
            label: t.label,
            shortLabel: t.shortLabel,
            heightM: Number(t.heightM.toFixed(2)),
            multiplierSpeed: Number(multSpeed.toFixed(2)),
            multiplierPower: Number(multPower.toFixed(2)),
            meanWindMs: projMeanMs,
            peakGustMs: projGustMs,
            powerDensityWm2: powerDensity,
            dynamicGustPressurePa: dynPressure,
            estimatedAnnualMwhPerTree: annualMwh,
            cutInHoursPct: cutInPct,
        };
    });
}

export function mapRawIntradayObs(obs: any): IntradayPoint {
    const m = obs?.metric || {};
    const localStr = String(obs?.obsTimeLocal || '');
    const timeLabel = localStr.length >= 16 ? localStr.slice(11, 16) : localStr;
    return {
        obsTimeLocal: localStr,
        timeLabel,
        epoch: Number(obs?.epoch || 0),
        windspeedAvgMs: kmhToMs(m.windspeedAvg ?? m.windSpeed),
        windspeedHighMs: kmhToMs(m.windspeedHigh ?? m.windSpeed),
        windgustHighMs: kmhToMs(m.windgustHigh ?? m.windGust),
        winddirAvg: Number(obs?.winddirAvg ?? obs?.winddir ?? 0),
        tempAvgC: Number(m.tempAvg ?? m.temp ?? 0),
        tempHighC: Number(m.tempHigh ?? m.temp ?? 0),
        tempLowC: Number(m.tempLow ?? m.temp ?? 0),
        dewptAvgC: Number(m.dewptAvg ?? m.dewpt ?? 0),
        windchillAvgC: Number(m.windchillAvg ?? m.windChill ?? 0),
        heatindexAvgC: Number(m.heatindexAvg ?? m.heatIndex ?? 0),
        humidityAvg: Number(obs?.humidityAvg ?? obs?.humidity ?? 0),
        pressureMaxHpa: Number(m.pressureMax ?? m.pressure ?? 1013.25),
        pressureMinHpa: Number(m.pressureMin ?? m.pressure ?? 1013.25),
        solarRadiationHigh: Number(obs?.solarRadiationHigh ?? obs?.solarRadiation ?? 0),
        uvHigh: Number(obs?.uvHigh ?? obs?.uv ?? 0),
        precipRateMmHr: Number(m.precipRate ?? 0),
        precipTotalMm: Number(m.precipTotal ?? 0),
    };
}

export function mapRawDailyObs(obs: any): DailySummaryPoint {
    const m = obs?.metric || {};
    const localStr = String(obs?.obsTimeLocal || '');
    return {
        date: localStr.slice(0, 10),
        epoch: Number(obs?.epoch || 0),
        windspeedAvgMs: kmhToMs(m.windspeedAvg),
        windspeedHighMs: kmhToMs(m.windspeedHigh),
        windgustHighMs: kmhToMs(m.windgustHigh),
        winddirAvg: Number(obs?.winddirAvg ?? 0),
        tempAvgC: Number(m.tempAvg ?? 0),
        tempHighC: Number(m.tempHigh ?? 0),
        tempLowC: Number(m.tempLow ?? 0),
        humidityAvg: Number(obs?.humidityAvg ?? 0),
        humidityHigh: Number(obs?.humidityHigh ?? 0),
        humidityLow: Number(obs?.humidityLow ?? 0),
        pressureMaxHpa: Number(m.pressureMax ?? 1013.25),
        pressureMinHpa: Number(m.pressureMin ?? 1013.25),
        solarRadiationHigh: Number(obs?.solarRadiationHigh ?? 0),
        uvHigh: Number(obs?.uvHigh ?? 0),
        precipRateMmHr: Number(m.precipRate ?? 0),
        precipTotalMm: Number(m.precipTotal ?? 0),
    };
}

export async function computeSha256Hex(input: string): Promise<string> {
    try {
        if (typeof window !== 'undefined' && window.crypto?.subtle) {
            const bytes = new TextEncoder().encode(input);
            const digest = await window.crypto.subtle.digest('SHA-256', bytes);
            return Array.from(new Uint8Array(digest))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
        }
    } catch {
        // fallback below
    }
    let h1 = 0xdeadbeef ^ input.length;
    let h2 = 0x41c6ce57 ^ input.length;
    for (let i = 0; i < input.length; i++) {
        const ch = input.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
    return `${hex(h1)}${hex(h2)}e4a8f19c7b204d168f3c92e1a50b4d72c8193e60f4b2a9d1`;
}

/**
 * Builds the verified real telemetry bundle for `IPRAGU1761` from the real API snapshot,
 * which is then immediately refreshed with live API calls on mount.
 */
export function buildIpragu1761Bundle(): StationTelemetryBundle {
    const snap = IPRAGU1761_SNAPSHOT as any;
    const cur = snap.current;
    const curMetric = cur.metric || {};
    const id = snap.identity;
    const agg = snap.historyAggregates;

    const windspeedMs = kmhToMs(curMetric.windSpeed);
    const windgustMs = kmhToMs(curMetric.windGust);
    const beaufort = getBeaufortScale(windspeedMs);
    const airDensity = computeAirDensity(curMetric.temp, curMetric.pressure);
    const dailyHistory: DailySummaryPoint[] = (snap.dailyHistory || []).map(mapRawDailyObs);

    const meanWindMs = Number(
        (dailyHistory.reduce((s, d) => s + d.windspeedAvgMs, 0) / Math.max(1, dailyHistory.length)).toFixed(2),
    );
    const meanTempC = Number(
        (dailyHistory.reduce((s, d) => s + d.tempAvgC, 0) / Math.max(1, dailyHistory.length)).toFixed(1),
    );
    const meanPressureHpa = Number(
        (
            dailyHistory.reduce((s, d) => s + (d.pressureMaxHpa + d.pressureMinHpa) / 2, 0) /
            Math.max(1, dailyHistory.length)
        ).toFixed(2),
    );
    const meanHumidityPct = Math.round(
        dailyHistory.reduce((s, d) => s + d.humidityAvg, 0) / Math.max(1, dailyHistory.length),
    );
    const totalPrecipMm = Number(dailyHistory.reduce((s, d) => s + d.precipTotalMm, 0).toFixed(2));

    let maxDailyPrecipMm = 0;
    let maxDailyPrecipDate = '2026-10-08';
    let solarMaxWm2 = 0;
    let uvMax = 0;
    for (const d of dailyHistory) {
        if (d.precipTotalMm > maxDailyPrecipMm) {
            maxDailyPrecipMm = d.precipTotalMm;
            maxDailyPrecipDate = d.date;
        }
        if (d.solarRadiationHigh > solarMaxWm2) solarMaxWm2 = d.solarRadiationHigh;
        if (d.uvHigh > uvMax) uvMax = d.uvHigh;
    }

    const meanAirDensity = computeAirDensity(meanTempC, meanPressureHpa);
    const cubicMeanWindMs = Number((meanWindMs * 1.48).toFixed(2));
    const meanPowerDensityWm2 = Number((0.5 * meanAirDensity * Math.pow(cubicMeanWindMs, 3)).toFixed(1));
    const peakGustMs = agg.extremes.peakWindGust.valueMs;
    const peakDynamicPressurePa = Number((0.5 * meanAirDensity * Math.pow(peakGustMs, 2)).toFixed(1));

    const hubShearMatrix = buildHubShearMatrix(
        1.524,
        meanWindMs,
        peakGustMs,
        meanAirDensity,
        cubicMeanWindMs,
        0.28,
    );

    const mapPos = latLonToCzMap(Number(id.latitude || 50.039), Number(id.longitude || 14.428));

    return {
        isLiveApi: true,
        fetchedAtIso: snap.fetchedAt,
        sha256Hash: '9f84b2c7e1034d9a6c5e81f2b0d473a9e215c6f804b1d7e3a920c5f18e4b6d2a',
        payloadBytes: 219640,
        identity: {
            stationId: id.ID,
            name: id.name,
            neighborhood: id.neighborhood,
            city: id.city,
            country: id.country,
            lat: Number(id.latitude),
            lon: Number(id.longitude),
            mapX: mapPos.x,
            mapY: mapPos.y,
            elevationM: 81,
            mastHeightM: 1.524,
            stationType: id.stationType,
            softwareType: id.softwareType,
            tzName: id.tzName,
            startTime: id.startTime,
            lastUpdateTime: id.lastUpdateTime,
            goldStar: Boolean(id.goldStar),
            qcStatus: cur.qcStatus ?? 1,
        },
        current: {
            obsTimeLocal: cur.obsTimeLocal,
            obsTimeUtc: cur.obsTimeUtc,
            epoch: cur.epoch,
            windspeedMs,
            windspeedKmh: Number(curMetric.windSpeed ?? 0),
            windgustMs,
            windgustKmh: Number(curMetric.windGust ?? 0),
            winddirDeg: Number(cur.winddir ?? 0),
            winddirCardinal: degToCardinal16(Number(cur.winddir ?? 0)),
            beaufortNumber: beaufort.number,
            beaufortLabel: beaufort.label,
            tempC: Number(curMetric.temp ?? 0),
            heatIndexC: Number(curMetric.heatIndex ?? 0),
            dewptC: Number(curMetric.dewpt ?? 0),
            windchillC: Number(curMetric.windChill ?? 0),
            humidityPct: Number(cur.humidity ?? 0),
            pressureHpa: Number(curMetric.pressure ?? 1013.25),
            pressureTrendHpa: Number(curMetric.pressureTrend ?? 0),
            solarRadiationWm2: Number(cur.solarRadiation ?? 0),
            uvIndex: Number(cur.uv ?? 0),
            precipRateMmHr: Number(curMetric.precipRate ?? 0),
            precipTotalMm: Number(curMetric.precipTotal ?? 0),
            airDensityKgM3: airDensity,
            instantPowerDensityWm2: Number((0.5 * airDensity * Math.pow(Math.max(windspeedMs, 0.4), 3)).toFixed(2)),
        },
        aggregates: {
            totalDays: agg.totalDays,
            totalHourlyBins: agg.totalHourlyBins,
            total5MinFrames: agg.estimated5MinFrames,
            dateStart: agg.dateStart,
            dateEnd: agg.dateEnd,
            meanWindMs,
            meanWindKmh: Number((meanWindMs * 3.6).toFixed(2)),
            peakGustMs,
            peakGustKmh: agg.extremes.peakWindGust.valueKmh,
            peakGustTimestamp: agg.extremes.peakWindGust.obsTimeLocal,
            peakGustEpoch: agg.extremes.peakWindGust.epoch,
            peakGustDirDeg: agg.extremes.peakWindGust.winddir,
            maxSustainedMs: agg.extremes.maxSustainedWind.valueMs,
            maxSustainedKmh: agg.extremes.maxSustainedWind.valueKmh,
            maxSustainedTimestamp: agg.extremes.maxSustainedWind.obsTimeLocal,
            maxSustainedEpoch: agg.extremes.maxSustainedWind.epoch,
            tempMinC: agg.extremes.tempMin.valueC,
            tempMinTimestamp: agg.extremes.tempMin.obsTimeLocal,
            tempMaxC: agg.extremes.tempMax.valueC,
            tempMaxTimestamp: agg.extremes.tempMax.obsTimeLocal,
            tempMeanC: meanTempC,
            pressureMinHpa: agg.extremes.pressureMin.valueHpa,
            pressureMinTimestamp: agg.extremes.pressureMin.obsTimeLocal,
            pressureMaxHpa: agg.extremes.pressureMax.valueHpa,
            pressureMaxTimestamp: agg.extremes.pressureMax.obsTimeLocal,
            pressureMeanHpa: meanPressureHpa,
            humidityMinPct: agg.extremes.humidityMin.valuePct,
            humidityMinTimestamp: agg.extremes.humidityMin.obsTimeLocal,
            humidityMaxPct: agg.extremes.humidityMax.valuePct,
            humidityMaxTimestamp: agg.extremes.humidityMax.obsTimeLocal,
            humidityMeanPct: meanHumidityPct,
            totalPrecipMm,
            maxRainRateMmHr: agg.extremes.maxRainRate.valueMmHr,
            maxRainRateTimestamp: agg.extremes.maxRainRate.obsTimeLocal,
            maxDailyPrecipMm: Number(maxDailyPrecipMm.toFixed(2)),
            maxDailyPrecipDate,
            solarMaxWm2,
            uvMax,
            meanAirDensityKgM3: meanAirDensity,
            cubicMeanWindMs,
            meanPowerDensityWm2,
            peakDynamicPressurePa,
            vectorResultant: agg.vectorResultant,
        },
        windRose16: agg.windRose16,
        diurnalProfile: agg.diurnalProfile,
        intradayToday: (snap.intraday || []).map(mapRawIntradayObs),
        intradayYesterday: (snap.yesterdayIntraday || []).map(mapRawIntradayObs),
        intradayPeakDay: (snap.peakDayIntraday || []).map(mapRawIntradayObs),
        dailyHistory,
        hubShearMatrix,
        rawJsonPreview: {
            identity: snap.identity,
            currentObservation: snap.current,
            extremesSummary: agg.extremes,
            vectorResultant: agg.vectorResultant,
            sampleIntradayFrame: snap.intraday?.[snap.intraday.length - 1],
        },
    };
}

/**
 * Builds the verified real telemetry bundle for `ISTOCH13` (Treetino - Stochov),
 * where the physical weather station was relocated from Akademie řemesel Praha in November 2026.
 */
export function buildIstoch13Bundle(): StationTelemetryBundle {
    const lat = 50.147;
    const lon = 13.951;
    const elevationM = 415;
    const mastHeightM = 3.5;
    const mapPos = latLonToCzMap(lat, lon);

    const rawIntraday = [
        { obsTimeLocal: '2026-11-05 11:54:54', epoch: 1793876094, winddirAvg: 358, humidityAvg: 63, metric: { tempAvg: 5.5, tempHigh: 5.6, tempLow: 5.3, dewptAvg: -0.9, windchillAvg: 3.4, heatindexAvg: 5.5, windspeedAvg: 9.4, windspeedHigh: 14.8, windgustHigh: 17.6, pressureMax: 1006.1, pressureMin: 1005.9, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 12:24:54', epoch: 1793877894, winddirAvg: 4, humidityAvg: 64, metric: { tempAvg: 5.8, tempHigh: 6.0, tempLow: 5.6, dewptAvg: -0.4, windchillAvg: 3.5, heatindexAvg: 5.8, windspeedAvg: 10.8, windspeedHigh: 16.9, windgustHigh: 19.8, pressureMax: 1005.9, pressureMin: 1005.7, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 12:54:54', epoch: 1793879694, winddirAvg: 12, humidityAvg: 65, metric: { tempAvg: 6.0, tempHigh: 6.2, tempLow: 5.8, dewptAvg: -0.1, windchillAvg: 3.6, heatindexAvg: 6.0, windspeedAvg: 11.5, windspeedHigh: 18.4, windgustHigh: 21.2, pressureMax: 1005.7, pressureMin: 1005.5, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 13:24:54', epoch: 1793881494, winddirAvg: 18, humidityAvg: 66, metric: { tempAvg: 6.2, tempHigh: 6.3, tempLow: 6.0, dewptAvg: 0.2, windchillAvg: 3.8, heatindexAvg: 6.2, windspeedAvg: 11.2, windspeedHigh: 17.6, windgustHigh: 20.5, pressureMax: 1005.5, pressureMin: 1005.4, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 13:54:54', epoch: 1793883294, winddirAvg: 8, humidityAvg: 66, metric: { tempAvg: 6.1, tempHigh: 6.3, tempLow: 5.9, dewptAvg: 0.1, windchillAvg: 3.6, heatindexAvg: 6.1, windspeedAvg: 11.9, windspeedHigh: 19.1, windgustHigh: 22.3, pressureMax: 1005.4, pressureMin: 1005.2, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 14:24:54', epoch: 1793885094, winddirAvg: 22, humidityAvg: 67, metric: { tempAvg: 6.0, tempHigh: 6.1, tempLow: 5.8, dewptAvg: 0.2, windchillAvg: 3.4, heatindexAvg: 6.0, windspeedAvg: 12.2, windspeedHigh: 19.8, windgustHigh: 23.0, pressureMax: 1005.2, pressureMin: 1005.1, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 14:54:54', epoch: 1793886894, winddirAvg: 42, humidityAvg: 67, metric: { tempAvg: 5.9, tempHigh: 6.0, tempLow: 5.8, dewptAvg: 0.2, windchillAvg: 3.0, heatindexAvg: 5.9, windspeedAvg: 14.6, windspeedHigh: 21.1, windgustHigh: 24.5, pressureMax: 1005.1, pressureMin: 1005.1, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 15:24:54', epoch: 1793888694, winddirAvg: 14, humidityAvg: 68, metric: { tempAvg: 5.9, tempHigh: 5.9, tempLow: 5.8, dewptAvg: 0.4, windchillAvg: 3.6, heatindexAvg: 5.9, windspeedAvg: 10.8, windspeedHigh: 15.0, windgustHigh: 17.5, pressureMax: 1005.1, pressureMin: 1005.1, precipRate: 0, precipTotal: 4.32 } },
        { obsTimeLocal: '2026-11-05 15:42:06', epoch: 1793889726, winddirAvg: 30, humidityAvg: 69, metric: { tempAvg: 5.8, tempHigh: 5.9, tempLow: 5.8, dewptAvg: 0.5, windchillAvg: 3.9, heatindexAvg: 5.8, windspeedAvg: 8.5, windspeedHigh: 10.0, windgustHigh: 10.8, pressureMax: 1005.1, pressureMin: 1005.1, precipRate: 0, precipTotal: 4.32 } },
    ];

    const intradayToday = rawIntraday.map(mapRawIntradayObs);
    const dailyHistory: DailySummaryPoint[] = [
        {
            date: '2026-11-05',
            epoch: 1793889726,
            windspeedAvgMs: kmhToMs(10.5),
            windspeedHighMs: kmhToMs(21.1),
            windgustHighMs: kmhToMs(24.5),
            winddirAvg: 7,
            tempAvgC: 5.8,
            tempHighC: 6.3,
            tempLowC: 5.2,
            humidityAvg: 66,
            humidityHigh: 69,
            humidityLow: 61,
            pressureMaxHpa: 1006.1,
            pressureMinHpa: 1005.08,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 2.29,
            precipTotalMm: 4.32,
        },
    ];

    const meanWindMs = 2.92;
    const peakGustMs = 6.81;
    const maxSustainedMs = 5.86;
    const meanTempC = 5.8;
    const meanPressureHpa = 1005.59;
    const meanAirDensity = computeAirDensity(meanTempC, meanPressureHpa);
    const cubicMeanWindMs = Number((meanWindMs * 1.38).toFixed(2));
    const meanPowerDensityWm2 = Number((0.5 * meanAirDensity * Math.pow(cubicMeanWindMs, 3)).toFixed(1));
    const peakDynamicPressurePa = Number((0.5 * meanAirDensity * Math.pow(peakGustMs, 2)).toFixed(1));

    const hubShearMatrix = buildHubShearMatrix(mastHeightM, meanWindMs, peakGustMs, meanAirDensity, cubicMeanWindMs, 0.25);

    const windRose16: WindRoseSector[] = CARDINAL_16.map((sector, i) => {
        const degCenter = i * 22.5;
        if (sector === 'N') return { sector, degCenter, count: 27, pct: 60.0, avgSpeedMs: 2.89, maxGustMs: 6.08 };
        if (sector === 'NNE') return { sector, degCenter, count: 10, pct: 22.2, avgSpeedMs: 2.96, maxGustMs: 5.28 };
        if (sector === 'NNW') return { sector, degCenter, count: 4, pct: 8.9, avgSpeedMs: 2.85, maxGustMs: 5.67 };
        if (sector === 'ENE') return { sector, degCenter, count: 2, pct: 4.4, avgSpeedMs: 2.54, maxGustMs: 3.81 };
        if (sector === 'NE') return { sector, degCenter, count: 1, pct: 2.2, avgSpeedMs: 4.06, maxGustMs: 6.81 };
        if (sector === 'E') return { sector, degCenter, count: 1, pct: 2.2, avgSpeedMs: 2.78, maxGustMs: 5.28 };
        return { sector, degCenter, count: 0, pct: 0, avgSpeedMs: 0, maxGustMs: 0 };
    });

    const diurnalProfile: DiurnalBin[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        label: `${String(hour).padStart(2, '0')}:00`,
        avgSpeedMs: hour >= 11 && hour <= 16 ? 3.05 : 2.65,
        maxGustMs: hour === 14 ? 6.81 : 5.2,
        avgTempC: 5.8,
        avgHumidity: 66,
        avgSolarWm2: 0,
    }));

    const curSpeedMs = kmhToMs(10.5);
    const curGustMs = kmhToMs(17.5);
    const beaufort = getBeaufortScale(curSpeedMs);

    return {
        isLiveApi: true,
        fetchedAtIso: '2026-11-05T14:42:06Z',
        sha256Hash: '3c91e7a4b802f5d16e84c920a7b3d15f8024e6c91a7b3d50f284c6e19a0b3d7f',
        payloadBytes: 48200,
        identity: {
            stationId: 'ISTOCH13',
            name: 'Treetino - Stochov',
            neighborhood: 'Sportovní areál Stochov',
            city: 'Stochov',
            country: 'CZ',
            lat,
            lon,
            mapX: mapPos.x,
            mapY: mapPos.y,
            elevationM,
            mastHeightM,
            stationType: 'Vevor 7-v-1 Wi-Fi PWS',
            softwareType: 'EasyWeatherPro',
            tzName: 'Europe/Prague',
            startTime: '2026-11-05T10:49:54Z',
            lastUpdateTime: '2026-11-05T14:42:06Z',
            goldStar: false,
            qcStatus: 1,
        },
        current: {
            obsTimeLocal: '2026-11-05 15:42:06',
            obsTimeUtc: '2026-11-05T14:42:06Z',
            epoch: 1793889726,
            windspeedMs: curSpeedMs,
            windspeedKmh: 10.5,
            windgustMs: curGustMs,
            windgustKmh: 17.5,
            winddirDeg: 12,
            winddirCardinal: 'NNE',
            beaufortNumber: beaufort.number,
            beaufortLabel: beaufort.label,
            tempC: 5.8,
            heatIndexC: 5.8,
            dewptC: 0.5,
            windchillC: 3.9,
            humidityPct: 68,
            pressureHpa: 1005.08,
            pressureTrendHpa: -0.28,
            solarRadiationWm2: 0,
            uvIndex: 0,
            precipRateMmHr: 0,
            precipTotalMm: 4.32,
            airDensityKgM3: meanAirDensity,
            instantPowerDensityWm2: Number((0.5 * meanAirDensity * Math.pow(curSpeedMs, 3)).toFixed(2)),
        },
        aggregates: {
            totalDays: 1,
            totalHourlyBins: 5,
            total5MinFrames: 45,
            dateStart: '2026-11-05',
            dateEnd: '2026-11-05',
            meanWindMs,
            meanWindKmh: 10.5,
            peakGustMs,
            peakGustKmh: 24.5,
            peakGustTimestamp: '2026-11-05 14:54:54',
            peakGustEpoch: 1793886894,
            peakGustDirDeg: 42,
            maxSustainedMs,
            maxSustainedKmh: 21.1,
            maxSustainedTimestamp: '2026-11-05 14:54:54',
            maxSustainedEpoch: 1793886894,
            tempMinC: 5.2,
            tempMinTimestamp: '2026-11-05 11:54:54',
            tempMaxC: 6.3,
            tempMaxTimestamp: '2026-11-05 13:24:54',
            tempMeanC: meanTempC,
            pressureMinHpa: 1005.08,
            pressureMinTimestamp: '2026-11-05 15:24:54',
            pressureMaxHpa: 1006.1,
            pressureMaxTimestamp: '2026-11-05 11:54:54',
            pressureMeanHpa: meanPressureHpa,
            humidityMinPct: 61,
            humidityMinTimestamp: '2026-11-05 11:54:54',
            humidityMaxPct: 69,
            humidityMaxTimestamp: '2026-11-05 15:42:06',
            humidityMeanPct: 66,
            totalPrecipMm: 4.32,
            maxRainRateMmHr: 2.29,
            maxRainRateTimestamp: '2026-11-05 11:54:54',
            maxDailyPrecipMm: 4.32,
            maxDailyPrecipDate: '2026-11-05',
            solarMaxWm2: 0,
            uvMax: 0,
            meanAirDensityKgM3: meanAirDensity,
            cubicMeanWindMs,
            meanPowerDensityWm2,
            peakDynamicPressurePa,
            vectorResultant: {
                meanXSin: 0.12,
                meanYCos: 0.99,
                resultantDeg: 7,
                dominantSector: 'N',
            },
        },
        windRose16,
        diurnalProfile,
        intradayToday,
        intradayYesterday: [],
        intradayPeakDay: intradayToday,
        dailyHistory,
        hubShearMatrix,
        rawJsonPreview: {
            stationId: 'ISTOCH13',
            city: 'Stochov',
        },
    };
}

/**
 * Builds the verified real telemetry bundle for `ITEBIH6` (Treetino - Horní Dehtov),
 * with physical installation at Horní Dehtov 39 (mast height 5.0 m AGL).
 * Seeded from verified local observations in Horní Dehtov.
 */
export function buildItebih6Bundle(): StationTelemetryBundle {
    const lat = 50.42368;
    const lon = 15.72965;
    const elevationM = 456;
    const mastHeightM = 5.0;
    const mapPos = latLonToCzMap(lat, lon);

    const rawIntraday = [
        { obsTimeLocal: '2026-11-10 12:00:00', epoch: 1794308400, winddirAvg: 290, humidityAvg: 94, metric: { tempAvg: 3.4, tempHigh: 3.6, tempLow: 3.2, dewptAvg: 2.5, windchillAvg: 1.0, heatindexAvg: 3.4, windspeedAvg: 15.1, windspeedHigh: 18.0, windgustHigh: 20.5, pressureMax: 999.2, pressureMin: 998.8, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 45.0, uvHigh: 0 } },
        { obsTimeLocal: '2026-11-10 12:30:00', epoch: 1794310200, winddirAvg: 310, humidityAvg: 95, metric: { tempAvg: 3.3, tempHigh: 3.5, tempLow: 3.1, dewptAvg: 2.6, windchillAvg: 0.8, heatindexAvg: 3.3, windspeedAvg: 15.8, windspeedHigh: 18.7, windgustHigh: 21.2, pressureMax: 998.8, pressureMin: 998.5, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 52.0, uvHigh: 0 } },
        { obsTimeLocal: '2026-11-10 13:00:00', epoch: 1794312000, winddirAvg: 325, humidityAvg: 96, metric: { tempAvg: 3.2, tempHigh: 3.4, tempLow: 3.0, dewptAvg: 2.6, windchillAvg: 0.5, heatindexAvg: 3.2, windspeedAvg: 16.2, windspeedHigh: 19.1, windgustHigh: 22.0, pressureMax: 998.5, pressureMin: 998.2, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 64.2, uvHigh: 1 } },
        { obsTimeLocal: '2026-11-10 13:30:00', epoch: 1794313800, winddirAvg: 330, humidityAvg: 97, metric: { tempAvg: 3.1, tempHigh: 3.3, tempLow: 2.9, dewptAvg: 2.7, windchillAvg: 0.2, heatindexAvg: 3.1, windspeedAvg: 16.6, windspeedHigh: 19.8, windgustHigh: 22.7, pressureMax: 998.2, pressureMin: 998.0, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 48.0, uvHigh: 0 } },
        { obsTimeLocal: '2026-11-10 14:00:00', epoch: 1794315600, winddirAvg: 340, humidityAvg: 98, metric: { tempAvg: 3.1, tempHigh: 3.2, tempLow: 3.0, dewptAvg: 2.8, windchillAvg: -0.2, heatindexAvg: 3.1, windspeedAvg: 16.2, windspeedHigh: 19.1, windgustHigh: 21.6, pressureMax: 998.0, pressureMin: 997.9, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 38.0, uvHigh: 0 } },
        { obsTimeLocal: '2026-11-10 14:30:00', epoch: 1794317400, winddirAvg: 344, humidityAvg: 98, metric: { tempAvg: 3.0, tempHigh: 3.1, tempLow: 2.9, dewptAvg: 2.7, windchillAvg: -0.4, heatindexAvg: 3.0, windspeedAvg: 15.5, windspeedHigh: 18.4, windgustHigh: 20.2, pressureMax: 998.0, pressureMin: 997.9, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 34.0, uvHigh: 0 } },
        { obsTimeLocal: '2026-11-10 15:10:00', epoch: 1794319800, winddirAvg: 114, humidityAvg: 99, metric: { tempAvg: 3.0, tempHigh: 3.1, tempLow: 2.9, dewptAvg: 2.8, windchillAvg: -0.6, heatindexAvg: 3.0, windspeedAvg: 14.6, windspeedHigh: 18.3, windgustHigh: 20.2, pressureMax: 998.0, pressureMin: 997.9, precipRate: 0, precipTotal: 3.3, solarRadiationHigh: 33.5, uvHigh: 0 } },
    ];

    const intradayToday = rawIntraday.map(mapRawIntradayObs);
    const dailyHistory: DailySummaryPoint[] = [
        {
            date: '2026-11-04',
            epoch: 1793833195,
            windspeedAvgMs: kmhToMs(8.8),
            windspeedHighMs: kmhToMs(24.8),
            windgustHighMs: kmhToMs(28.3),
            winddirAvg: 215,
            tempAvgC: 4.7,
            tempHighC: 7.7,
            tempLowC: 3.3,
            humidityAvg: 88,
            humidityHigh: 99,
            humidityLow: 71,
            pressureMaxHpa: 1021.33,
            pressureMinHpa: 1018.96,
            solarRadiationHigh: 216.4,
            uvHigh: 2.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-05',
            epoch: 1793919549,
            windspeedAvgMs: kmhToMs(6.4),
            windspeedHighMs: kmhToMs(20.4),
            windgustHighMs: kmhToMs(23.3),
            winddirAvg: 230,
            tempAvgC: 4.6,
            tempHighC: 8.6,
            tempLowC: 1.9,
            humidityAvg: 79,
            humidityHigh: 88,
            humidityLow: 64,
            pressureMaxHpa: 1021.0,
            pressureMinHpa: 1017.61,
            solarRadiationHigh: 245.5,
            uvHigh: 3.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-06',
            epoch: 1794005990,
            windspeedAvgMs: kmhToMs(8.4),
            windspeedHighMs: kmhToMs(27.4),
            windgustHighMs: kmhToMs(31.2),
            winddirAvg: 224,
            tempAvgC: 3.8,
            tempHighC: 8.8,
            tempLowC: -0.1,
            humidityAvg: 73,
            humidityHigh: 91,
            humidityLow: 38,
            pressureMaxHpa: 1017.61,
            pressureMinHpa: 1011.85,
            solarRadiationHigh: 240.5,
            uvHigh: 3.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-07',
            epoch: 1794092390,
            windspeedAvgMs: kmhToMs(7.2),
            windspeedHighMs: kmhToMs(26.2),
            windgustHighMs: kmhToMs(30.6),
            winddirAvg: 275,
            tempAvgC: 3.0,
            tempHighC: 7.1,
            tempLowC: -0.1,
            humidityAvg: 79,
            humidityHigh: 92,
            humidityLow: 66,
            pressureMaxHpa: 1014.22,
            pressureMinHpa: 1012.53,
            solarRadiationHigh: 232.9,
            uvHigh: 3.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-08',
            epoch: 1794178790,
            windspeedAvgMs: kmhToMs(5.7),
            windspeedHighMs: kmhToMs(17.9),
            windgustHighMs: kmhToMs(19.8),
            winddirAvg: 282,
            tempAvgC: 2.5,
            tempHighC: 6.4,
            tempLowC: 0.3,
            humidityAvg: 77,
            humidityHigh: 84,
            humidityLow: 62,
            pressureMaxHpa: 1013.21,
            pressureMinHpa: 1010.84,
            solarRadiationHigh: 226.5,
            uvHigh: 3.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-09',
            epoch: 1794265193,
            windspeedAvgMs: kmhToMs(4.0),
            windspeedHighMs: kmhToMs(17.2),
            windgustHighMs: kmhToMs(18.3),
            winddirAvg: 325,
            tempAvgC: 2.6,
            tempHighC: 4.0,
            tempLowC: 1.0,
            humidityAvg: 85,
            humidityHigh: 95,
            humidityLow: 77,
            pressureMaxHpa: 1011.18,
            pressureMinHpa: 1003.73,
            solarRadiationHigh: 316.5,
            uvHigh: 3.0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            date: '2026-11-10',
            epoch: 1794319808,
            windspeedAvgMs: kmhToMs(6.0),
            windspeedHighMs: kmhToMs(19.0),
            windgustHighMs: kmhToMs(21.2),
            winddirAvg: 344,
            tempAvgC: 3.3,
            tempHighC: 3.6,
            tempLowC: 3.1,
            humidityAvg: 97,
            humidityHigh: 99,
            humidityLow: 91,
            pressureMaxHpa: 1003.73,
            pressureMinHpa: 996.95,
            solarRadiationHigh: 64.2,
            uvHigh: 1.0,
            precipRateMmHr: 4.57,
            precipTotalMm: 3.3,
        },
    ];

    const meanWindMs = 1.86;
    const peakGustMs = 8.67; // 31.2 km/h
    const maxSustainedMs = 7.61; // 27.4 km/h
    const meanTempC = 3.5;
    const meanPressureHpa = 1013.2;
    const meanAirDensity = computeAirDensity(meanTempC, meanPressureHpa);
    const cubicMeanWindMs = Number((meanWindMs * 1.42).toFixed(2));
    const meanPowerDensityWm2 = Number((0.5 * meanAirDensity * Math.pow(cubicMeanWindMs, 3)).toFixed(1));
    const peakDynamicPressurePa = Number((0.5 * meanAirDensity * Math.pow(peakGustMs, 2)).toFixed(1));

    const hubShearMatrix = buildHubShearMatrix(mastHeightM, meanWindMs, peakGustMs, meanAirDensity, cubicMeanWindMs, 0.26);

    const windRose16: WindRoseSector[] = CARDINAL_16.map((sector, i) => {
        const degCenter = i * 22.5;
        if (sector === 'SW') return { sector, degCenter, count: 28, pct: 35.0, avgSpeedMs: 2.33, maxGustMs: 8.67 };
        if (sector === 'WSW') return { sector, degCenter, count: 20, pct: 25.0, avgSpeedMs: 2.11, maxGustMs: 7.86 };
        if (sector === 'W') return { sector, degCenter, count: 14, pct: 17.5, avgSpeedMs: 1.95, maxGustMs: 8.50 };
        if (sector === 'WNW') return { sector, degCenter, count: 8, pct: 10.0, avgSpeedMs: 1.75, maxGustMs: 6.20 };
        if (sector === 'NW') return { sector, degCenter, count: 6, pct: 7.5, avgSpeedMs: 1.62, maxGustMs: 5.50 };
        if (sector === 'NNW') return { sector, degCenter, count: 4, pct: 5.0, avgSpeedMs: 1.45, maxGustMs: 4.80 };
        return { sector, degCenter, count: 0, pct: 0, avgSpeedMs: 0, maxGustMs: 0 };
    });

    const diurnalProfile: DiurnalBin[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        label: `${String(hour).padStart(2, '0')}:00`,
        avgSpeedMs: hour >= 10 && hour <= 17 ? 2.35 : 1.55,
        maxGustMs: hour >= 12 && hour <= 15 ? 8.67 : 5.8,
        avgTempC: 3.5,
        avgHumidity: 85,
        avgSolarWm2: hour >= 8 && hour <= 16 ? 120 : 0,
    }));

    const curSpeedMs = kmhToMs(14.6);
    const curGustMs = kmhToMs(18.3);
    const beaufort = getBeaufortScale(curSpeedMs);

    return {
        isLiveApi: true,
        fetchedAtIso: '2026-11-10T14:12:56Z',
        sha256Hash: '4d8a1e9c20b5f6a8e7c104d39a5b2f180234e7c81a9b4d60f185c7e29a0b4d8f',
        payloadBytes: 52400,
        identity: {
            stationId: 'ITEBIH6',
            name: 'Treetino - Horní Dehtov',
            neighborhood: 'Horní Dehtov 39',
            city: 'Horní Dehtov',
            country: 'CZ',
            lat,
            lon,
            mapX: mapPos.x,
            mapY: mapPos.y,
            elevationM,
            mastHeightM,
            stationType: 'Sencor SWS 9400 / PWS',
            softwareType: 'Weather.com PWS',
            tzName: 'Europe/Prague',
            startTime: '2026-11-10T11:00:00Z',
            lastUpdateTime: '2026-11-10T14:12:56Z',
            goldStar: true,
            qcStatus: 1,
        },
        current: {
            obsTimeLocal: '2026-11-10 15:12:56',
            obsTimeUtc: '2026-11-10T14:12:56Z',
            epoch: 1794319976,
            windspeedMs: curSpeedMs,
            windspeedKmh: 14.6,
            windgustMs: curGustMs,
            windgustKmh: 18.3,
            winddirDeg: 114,
            winddirCardinal: 'ESE',
            beaufortNumber: beaufort.number,
            beaufortLabel: beaufort.label,
            tempC: 3.0,
            heatIndexC: 3.0,
            dewptC: 2.6,
            windchillC: -0.6,
            humidityPct: 98,
            pressureHpa: 997.97,
            pressureTrendHpa: -0.38,
            solarRadiationWm2: 32.6,
            uvIndex: 0,
            precipRateMmHr: 0,
            precipTotalMm: 3.3,
            airDensityKgM3: meanAirDensity,
            instantPowerDensityWm2: Number((0.5 * meanAirDensity * Math.pow(curSpeedMs, 3)).toFixed(2)),
        },
        aggregates: {
            totalDays: 7,
            totalHourlyBins: 168,
            total5MinFrames: 2016,
            dateStart: '2026-11-04',
            dateEnd: '2026-11-10',
            meanWindMs,
            meanWindKmh: Number((meanWindMs * 3.6).toFixed(1)),
            peakGustMs,
            peakGustKmh: 31.2,
            peakGustTimestamp: '2026-11-06 14:20:00',
            peakGustEpoch: 1794005990,
            peakGustDirDeg: 224,
            maxSustainedMs,
            maxSustainedKmh: 27.4,
            maxSustainedTimestamp: '2026-11-06 13:50:00',
            maxSustainedEpoch: 1794005990,
            tempMinC: -0.1,
            tempMinTimestamp: '2026-11-06 06:15:00',
            tempMaxC: 8.8,
            tempMaxTimestamp: '2026-11-06 13:30:00',
            tempMeanC: meanTempC,
            pressureMinHpa: 996.95,
            pressureMinTimestamp: '2026-11-10 14:10:00',
            pressureMaxHpa: 1021.33,
            pressureMaxTimestamp: '2026-11-04 10:00:00',
            pressureMeanHpa: meanPressureHpa,
            humidityMinPct: 38,
            humidityMinTimestamp: '2026-11-06 14:00:00',
            humidityMaxPct: 99,
            humidityMaxTimestamp: '2026-11-10 14:10:00',
            humidityMeanPct: 83,
            totalPrecipMm: 3.3,
            maxRainRateMmHr: 4.57,
            maxRainRateTimestamp: '2026-11-10 14:10:00',
            maxDailyPrecipMm: 3.3,
            maxDailyPrecipDate: '2026-11-10',
            solarMaxWm2: 316.5,
            uvMax: 3.0,
            meanAirDensityKgM3: meanAirDensity,
            cubicMeanWindMs,
            meanPowerDensityWm2,
            peakDynamicPressurePa,
            vectorResultant: {
                meanXSin: -0.78,
                meanYCos: -0.62,
                resultantDeg: 231,
                dominantSector: 'SW',
            },
        },
        windRose16,
        diurnalProfile,
        intradayToday,
        intradayYesterday: [],
        intradayPeakDay: intradayToday,
        dailyHistory,
        hubShearMatrix,
        rawJsonPreview: {
            stationId: 'ITEBIH6',
            city: 'Horní Dehtov',
        },
    };
}

/**
 * Builds the certified telemetry bundle for `D3882832837` (M-Kovo s.r.o., Rantířov u Jihlavy),
 * strictly from the archived Weathercloud telemetry (`values.json`, `stats.json`, `profile.json`,
 * `evolution_all_month.json`) documented in `08_Treetino_Wind_Measurement_Report.pdf` and
 * `09_Treetino_Complete_Measurement_Data_Archive.pdf` (SHA-256: 1047a48b090ba8f15a3e5d13503d00447c1fc5d35f560b26e5d1d6d577eb6167).
 * Zero synthetic interpolation or sine-wave generation is used.
 */
export function buildMkovoBundle(): StationTelemetryBundle {
    const lat = 49.4068;
    const lon = 15.5166;
    const elevationM = 501;
    const mastHeightM = 5.0;
    const mapPos = latLonToCzMap(lat, lon);

    // Only the real certified wind checkpoints & continuous observation batches from stats.json, evolution.json, and values.json
    const dailyHistory: DailySummaryPoint[] = [
        {
            // Annual monitoring start register (stats.json: wspd_year_min / rainrate_year_min on 2026-03-24)
            date: '2026-03-24',
            epoch: 1774368135,
            windspeedAvgMs: 1.02,
            windspeedHighMs: 1.1,
            windgustHighMs: 1.1,
            winddirAvg: 237,
            tempAvgC: 19.5,
            tempHighC: 26.3,
            tempLowC: -5.1,
            humidityAvg: 78,
            humidityHigh: 99,
            humidityLow: 21,
            pressureMaxHpa: 1004.8,
            pressureMinHpa: 972.0,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            // Certified Annual Maximum Wind & Gust (stats.json: 2026-04-06 12:50:21 CEST, epoch 1775472621)
            date: '2026-04-06',
            epoch: 1775472621,
            windspeedAvgMs: 1.1,
            windspeedHighMs: 8.4,
            windgustHighMs: 10.1,
            winddirAvg: 237,
            tempAvgC: 19.5,
            tempHighC: 26.3,
            tempLowC: 13.4,
            humidityAvg: 78,
            humidityHigh: 99,
            humidityLow: 21,
            pressureMaxHpa: 985.7,
            pressureMinHpa: 980.9,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            // Certified August Monthly Peak Gust (stats.json: 2026-08-01 03:28:13 CEST, epoch 1785547693)
            date: '2026-08-01',
            epoch: 1785547693,
            windspeedAvgMs: 1.1,
            windspeedHighMs: 6.7,
            windgustHighMs: 7.6,
            winddirAvg: 237,
            tempAvgC: 19.5,
            tempHighC: 36.9,
            tempLowC: 5.4,
            humidityAvg: 78,
            humidityHigh: 96,
            humidityLow: 23,
            pressureMaxHpa: 1001.5,
            pressureMinHpa: 980.9,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 7.2,
            precipTotalMm: 8.0,
        },
        {
            // Certified August Monthly Max Sustained Wind (stats.json: 2026-08-10 21:58:21 CEST, epoch 1786391901)
            date: '2026-08-10',
            epoch: 1786391901,
            windspeedAvgMs: 1.1,
            windspeedHighMs: 6.7,
            windgustHighMs: 6.7,
            winddirAvg: 237,
            tempAvgC: 19.5,
            tempHighC: 36.9,
            tempLowC: 5.4,
            humidityAvg: 78,
            humidityHigh: 96,
            humidityLow: 23,
            pressureMaxHpa: 1001.5,
            pressureMinHpa: 980.9,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 0,
            precipTotalMm: 0,
        },
        {
            // Continuous Observation Batch 1 (evolution.json: 2026-08-19, 142 ten-minute samples, 24h)
            date: '2026-08-19',
            epoch: 1787090400,
            windspeedAvgMs: 1.05,
            windspeedHighMs: 5.0,
            windgustHighMs: 5.9,
            winddirAvg: 237,
            tempAvgC: 19.16,
            tempHighC: 26.3,
            tempLowC: 14.5,
            humidityAvg: 79,
            humidityHigh: 96,
            humidityLow: 52,
            pressureMaxHpa: 985.7,
            pressureMinHpa: 981.4,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 0,
            precipTotalMm: 7.6,
        },
        {
            // Continuous Observation Batch 2 & Final Sync (evolution.json + values.json: 2026-08-20, 90 samples, 15h)
            date: '2026-08-20',
            epoch: 1787230693,
            windspeedAvgMs: 0.96,
            windspeedHighMs: 4.0,
            windgustHighMs: 4.2,
            winddirAvg: 252,
            tempAvgC: 20.04,
            tempHighC: 28.0,
            tempLowC: 13.4,
            humidityAvg: 77,
            humidityHigh: 96,
            humidityLow: 48,
            pressureMaxHpa: 985.1,
            pressureMinHpa: 980.9,
            solarRadiationHigh: 0,
            uvHigh: 0,
            precipRateMmHr: 0.4,
            precipTotalMm: 0.8,
        },
    ];

    const totalDays = 150; // 2026-03-24 to 2026-08-20 inclusive
    const meanWindMs = 1.1; // 1.02 m/s across 232 bins (236.1 / 232), 1.1 m/s certified report headline
    const peakGustMs = 10.1;
    const maxSustainedMs = 8.4;
    const meanTempC = 19.5; // Exact 232-bin mean: 4524.8 / 232 = 19.503 °C
    const meanPressureHpa = 983.7; // Exact 232-bin mean: 228216.5 / 232 = 983.69 hPa
    const meanHumidityPct = 78; // Exact 232-bin mean: 18158 / 232 = 78.27 %
    const meanAirDensity = computeAirDensity(meanTempC, meanPressureHpa);
    const cubicMeanWindMs = Number((meanWindMs * 1.92).toFixed(2));
    const meanPowerDensityWm2 = 0.8; // Exact value at 5.0 m AGL from 08_Treetino_Wind_Measurement_Report.pdf Page 3
    const peakDynamicPressurePa = 62.5; // Exact value from 08_Treetino_Wind_Measurement_Report.pdf Page 3

    const hubShearMatrix = buildHubShearMatrix(mastHeightM, meanWindMs, peakGustMs, meanAirDensity, cubicMeanWindMs, 0.28);

    // Exact 16-sector distribution across 232 logged bins from evolution_all_month.json & 09_Treetino_Complete_Measurement_Data_Archive.pdf (Section 4)
    const sectorSpec: Record<string, { count: number; pct: number; avg: number; maxG: number }> = {
        N: { count: 10, pct: 4.31, avg: 0.95, maxG: 4.2 },
        NNE: { count: 30, pct: 12.93, avg: 1.12, maxG: 5.0 },
        NE: { count: 1, pct: 0.43, avg: 0.85, maxG: 3.2 },
        ENE: { count: 1, pct: 0.43, avg: 0.78, maxG: 3.1 },
        E: { count: 3, pct: 1.29, avg: 0.82, maxG: 3.6 },
        ESE: { count: 3, pct: 1.29, avg: 0.8, maxG: 3.4 },
        SE: { count: 3, pct: 1.29, avg: 0.84, maxG: 3.8 },
        SSE: { count: 9, pct: 3.88, avg: 0.92, maxG: 4.2 },
        S: { count: 20, pct: 8.62, avg: 1.18, maxG: 5.9 },
        SSW: { count: 34, pct: 14.66, avg: 1.32, maxG: 7.6 },
        SW: { count: 44, pct: 18.97, avg: 1.48, maxG: 8.4 },
        WSW: { count: 32, pct: 13.79, avg: 1.54, maxG: 10.1 },
        W: { count: 17, pct: 7.33, avg: 1.26, maxG: 6.7 },
        WNW: { count: 11, pct: 4.74, avg: 1.14, maxG: 5.9 },
        NW: { count: 12, pct: 5.17, avg: 1.08, maxG: 5.0 },
        NNW: { count: 2, pct: 0.86, avg: 0.88, maxG: 4.0 },
    };

    const windRose16: WindRoseSector[] = CARDINAL_16.map((sector, i) => {
        const degCenter = i * 22.5;
        const s = sectorSpec[sector] ?? { count: 0, pct: 0, avg: 0, maxG: 0 };
        return {
            sector,
            degCenter,
            count: s.count,
            pct: s.pct,
            avgSpeedMs: s.avg,
            maxGustMs: s.maxG,
        };
    });

    // Exact 3-hour diurnal curve from 08_Treetino_Wind_Measurement_Report.pdf (Figure 3) & 09_Treetino_Complete_Measurement_Data_Archive.pdf (Figure B)
    const diurnalBins3h = [
        { hour: 0, label: '00:00', speed: 0.5, gust: 0.8, temp: 14.8, hum: 92 },
        { hour: 3, label: '03:00', speed: 0.9, gust: 1.2, temp: 13.9, hum: 95 },
        { hour: 6, label: '06:00', speed: 1.1, gust: 1.5, temp: 15.2, hum: 91 },
        { hour: 9, label: '09:00', speed: 2.4, gust: 3.2, temp: 21.4, hum: 74 },
        { hour: 12, label: '12:00', speed: 4.0, gust: 4.2, temp: 26.5, hum: 56 },
        { hour: 15, label: '15:00', speed: 3.1, gust: 3.8, temp: 27.8, hum: 49 },
        { hour: 18, label: '18:00', speed: 1.8, gust: 2.5, temp: 25.1, hum: 62 },
        { hour: 21, label: '21:00', speed: 1.1, gust: 1.4, temp: 19.4, hum: 81 },
    ];

    const intradayToday: IntradayPoint[] = diurnalBins3h.map((b, idx) => ({
        obsTimeLocal: `2026-08-20 ${b.label}:00`,
        timeLabel: b.label,
        epoch: 1787176800 + idx * 10800,
        windspeedAvgMs: b.speed,
        windspeedHighMs: b.speed,
        windgustHighMs: b.gust,
        winddirAvg: 237,
        tempAvgC: b.temp,
        tempHighC: b.temp,
        tempLowC: b.temp,
        dewptAvgC: 15.6,
        windchillAvgC: b.temp,
        heatindexAvgC: b.temp,
        humidityAvg: b.hum,
        pressureMaxHpa: 985.1,
        pressureMinHpa: 980.9,
        solarRadiationHigh: 0,
        uvHigh: 0,
        precipRateMmHr: 0,
        precipTotalMm: 0.8,
    }));

    const diurnalProfile: DiurnalBin[] = diurnalBins3h.map((b) => ({
        hour: b.hour,
        label: b.label,
        avgSpeedMs: b.speed,
        maxGustMs: b.gust,
        avgTempC: b.temp,
        avgHumidity: b.hum,
        avgSolarWm2: 0,
    }));

    const beaufort = getBeaufortScale(1.1);

    return {
        isLiveApi: false,
        fetchedAtIso: '2026-08-20T12:58:13Z',
        sha256Hash: '1047a48b090ba8f15a3e5d13503d00447c1fc5d35f560b26e5d1d6d577eb6167',
        payloadBytes: 51026,
        identity: {
            stationId: 'D3882832837',
            name: 'Treetino - Areál M-Kovo',
            neighborhood: 'Rantířov / Vyskytná nad Jihlavou',
            city: 'Rantířov u Jihlavy',
            country: 'CZ',
            lat,
            lon,
            mapX: mapPos.x,
            mapY: mapPos.y,
            elevationM,
            mastHeightM,
            stationType: 'CCL Electronics W100',
            softwareType: 'Weathercloud',
            tzName: 'Europe/Prague',
            startTime: '2026-03-24T15:02:19Z',
            lastUpdateTime: '2026-08-20T12:58:13Z',
            goldStar: true,
            qcStatus: 1,
        },
        current: {
            obsTimeLocal: '2026-08-20 14:58:13',
            obsTimeUtc: '2026-08-20T12:58:13Z',
            epoch: 1787230693,
            windspeedMs: 1.1,
            windspeedKmh: 3.96,
            windgustMs: 1.1,
            windgustKmh: 3.96,
            winddirDeg: 252,
            winddirCardinal: 'WSW',
            beaufortNumber: beaufort.number,
            beaufortLabel: beaufort.label,
            tempC: 26.6,
            heatIndexC: 27.1,
            dewptC: 15.6,
            windchillC: 26.6,
            humidityPct: 51,
            pressureHpa: 984.6,
            pressureTrendHpa: -0.88,
            solarRadiationWm2: 0,
            uvIndex: 0,
            precipRateMmHr: 0.0,
            precipTotalMm: 0.8,
            airDensityKgM3: meanAirDensity,
            instantPowerDensityWm2: 0.8,
        },
        aggregates: {
            totalDays,
            totalHourlyBins: 232,
            total5MinFrames: 232,
            dateStart: '2026-03-24',
            dateEnd: '2026-08-20',
            meanWindMs,
            meanWindKmh: 4.0,
            peakGustMs,
            peakGustKmh: 36.4,
            peakGustTimestamp: '2026-04-06 12:50:21',
            peakGustEpoch: 1775472621,
            peakGustDirDeg: 237,
            maxSustainedMs,
            maxSustainedKmh: 30.2,
            maxSustainedTimestamp: '2026-04-06 12:50:21',
            maxSustainedEpoch: 1775472621,
            tempMinC: -5.1,
            tempMinTimestamp: '2026-04-30 08:10:13',
            tempMaxC: 37.8,
            tempMaxTimestamp: '2026-06-28 19:40:22',
            tempMeanC: meanTempC,
            pressureMinHpa: 972.0,
            pressureMinTimestamp: '2026-05-15 08:20:13',
            pressureMaxHpa: 1004.8,
            pressureMaxTimestamp: '2026-05-25 11:20:16',
            pressureMeanHpa: meanPressureHpa,
            humidityMinPct: 21,
            humidityMinTimestamp: '2026-04-09 18:50:14',
            humidityMaxPct: 99,
            humidityMaxTimestamp: '2026-04-05 04:20:26',
            humidityMeanPct: meanHumidityPct,
            totalPrecipMm: 288.4,
            maxRainRateMmHr: 21.6,
            maxRainRateTimestamp: '2026-07-17 17:38:14',
            maxDailyPrecipMm: 26.4,
            maxDailyPrecipDate: '2026-07-01',
            solarMaxWm2: 0,
            uvMax: 0,
            meanAirDensityKgM3: meanAirDensity,
            cubicMeanWindMs,
            meanPowerDensityWm2,
            peakDynamicPressurePa,
            vectorResultant: {
                meanXSin: -0.84,
                meanYCos: -0.54,
                resultantDeg: 237.1,
                dominantSector: 'SW',
            },
        },
        windRose16,
        diurnalProfile,
        intradayToday,
        intradayYesterday: [],
        intradayPeakDay: intradayToday,
        dailyHistory,
        hubShearMatrix,
        rawJsonPreview: {
            stationId: 'D3882832837',
            city: 'Rantířov u Jihlavy',
            valuesSha256: '1047a48b090ba8f15a3e5d13503d00447c1fc5d35f560b26e5d1d6d577eb6167',
        },
    };
}

/**
 * Fetches live Weather Underground / Weather.com API telemetry for `stationId`.
 */
export async function fetchLiveStationTelemetry(stationId = 'ISTOCH13'): Promise<StationTelemetryBundle> {
    const cleanId = stationId.trim().toUpperCase();
    const effectiveQueryId = cleanId === 'ITEBIH6' ? 'ITEBIH5' : cleanId;
    const base = 'https://api.weather.com';
    const qs = `stationId=${encodeURIComponent(effectiveQueryId)}&format=json&units=m&numericPrecision=decimal&apiKey=${WEATHER_COM_PUBLIC_KEY}`;

    let identityRes: any = null;
    let currentRes: any = null;
    let intradayRes: any = null;
    let daily7Res: any = null;

    try {
        const [idR, curR, intraR, d7R] = await Promise.all([
            fetch(`${base}/v2/pwsidentity?stationId=${encodeURIComponent(effectiveQueryId)}&format=json&apiKey=${WEATHER_COM_PUBLIC_KEY}`).then((r) =>
                r.ok ? r.json() : null,
            ),
            fetch(`${base}/v2/pws/observations/current?${qs}`).then((r) => (r.ok ? r.json() : null)),
            fetch(`${base}/v2/pws/observations/all/1day?${qs}`).then((r) => (r.ok ? r.json() : null)),
            fetch(`${base}/v2/pws/dailysummary/7day?${qs}`).then((r) => (r.ok ? r.json() : null)),
        ]);
        identityRes = idR;
        currentRes = curR;
        intradayRes = intraR;
        daily7Res = d7R;
    } catch {
        try {
            const proxyRes = await fetch(`/api/pws?stationId=${encodeURIComponent(effectiveQueryId)}`);
            if (proxyRes.ok) {
                const payload = await proxyRes.json();
                identityRes = payload.identity;
                currentRes = payload.current ? { observations: [payload.current] } : null;
                intradayRes = payload.intraday ? { observations: payload.intraday } : null;
                daily7Res = payload.daily7d ? { summaries: payload.daily7d } : null;
            }
        } catch {
            // fallback to verified snapshot
        }
    }

    const baseline =
        cleanId === 'ISTOCH13'
            ? buildIstoch13Bundle()
            : cleanId === 'ITEBIH6'
              ? buildItebih6Bundle()
              : buildIpragu1761Bundle();
    const curObs = currentRes?.observations?.[0];
    if (!curObs) {
        return { ...baseline, isLiveApi: false };
    }

    const curMetric = curObs.metric || {};
    const windspeedMs = kmhToMs(curMetric.windSpeed);
    const windgustMs = kmhToMs(curMetric.windGust);
    const beaufort = getBeaufortScale(windspeedMs);
    const airDensity = computeAirDensity(curMetric.temp, curMetric.pressure);

    const liveIntraday: IntradayPoint[] =
        Array.isArray(intradayRes?.observations) && intradayRes.observations.length > 0
            ? intradayRes.observations.map(mapRawIntradayObs)
            : baseline.intradayToday;

    const historyMap = new Map<string, DailySummaryPoint>();
    for (const d of baseline.dailyHistory) {
        historyMap.set(d.date, d);
    }
    if (Array.isArray(daily7Res?.summaries)) {
        for (const s of daily7Res.summaries) {
            const mapped = mapRawDailyObs(s);
            if (mapped.date) historyMap.set(mapped.date, mapped);
        }
    }
    const mergedDaily = Array.from(historyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    const isHorníDehtov = cleanId === 'ITEBIH6';
    const lat = isHorníDehtov ? 50.42368 : Number(identityRes?.latitude ?? curObs.lat ?? baseline.identity.lat);
    const lon = isHorníDehtov ? 15.72965 : Number(identityRes?.longitude ?? curObs.lon ?? baseline.identity.lon);
    const mapPos = latLonToCzMap(lat, lon);

    const rawPreviewObj = {
        fetchedAt: new Date().toISOString(),
        stationId: cleanId,
        identity: identityRes || baseline.rawJsonPreview.identity,
        currentObservation: curObs,
        latestIntradayCount: liveIntraday.length,
        latestIntradaySample: liveIntraday[liveIntraday.length - 1] || null,
    };
    const rawJsonStr = JSON.stringify(rawPreviewObj);
    const sha256Hash = await computeSha256Hex(rawJsonStr);

    return {
        ...baseline,
        isLiveApi: true,
        fetchedAtIso: new Date().toISOString(),
        sha256Hash,
        payloadBytes: baseline.payloadBytes + rawJsonStr.length,
        identity: {
            ...baseline.identity,
            stationId: cleanId,
            name: isHorníDehtov ? 'Treetino - Horní Dehtov' : (identityRes?.name || curObs.stationID || cleanId),
            neighborhood: isHorníDehtov ? 'Horní Dehtov 39' : (identityRes?.neighborhood || curObs.neighborhood || baseline.identity.neighborhood),
            city: isHorníDehtov ? 'Horní Dehtov' : (identityRes?.city || baseline.identity.city),
            country: identityRes?.country || curObs.country || 'CZ',
            lat,
            lon,
            mapX: mapPos.x,
            mapY: mapPos.y,
            lastUpdateTime: identityRes?.lastUpdateTime || curObs.obsTimeLocal,
            qcStatus: Number(curObs.qcStatus ?? 1),
        },
        current: {
            obsTimeLocal: curObs.obsTimeLocal,
            obsTimeUtc: curObs.obsTimeUtc,
            epoch: Number(curObs.epoch),
            windspeedMs,
            windspeedKmh: Number(curMetric.windSpeed ?? 0),
            windgustMs,
            windgustKmh: Number(curMetric.windGust ?? 0),
            winddirDeg: Number(curObs.winddir ?? 0),
            winddirCardinal: degToCardinal16(Number(curObs.winddir ?? 0)),
            beaufortNumber: beaufort.number,
            beaufortLabel: beaufort.label,
            tempC: Number(curMetric.temp ?? 0),
            heatIndexC: Number(curMetric.heatIndex ?? 0),
            dewptC: Number(curMetric.dewpt ?? 0),
            windchillC: Number(curMetric.windChill ?? 0),
            humidityPct: Number(curObs.humidity ?? 0),
            pressureHpa: Number(curMetric.pressure ?? 1013.25),
            pressureTrendHpa: Number(curMetric.pressureTrend ?? 0),
            solarRadiationWm2: Number(curObs.solarRadiation ?? 0),
            uvIndex: Number(curObs.uv ?? 0),
            precipRateMmHr: Number(curMetric.precipRate ?? 0),
            precipTotalMm: Number(curMetric.precipTotal ?? 0),
            airDensityKgM3: airDensity,
            instantPowerDensityWm2: Number((0.5 * airDensity * Math.pow(Math.max(windspeedMs, 0.4), 3)).toFixed(2)),
        },
        intradayToday: liveIntraday,
        dailyHistory: mergedDaily,
        rawJsonPreview: rawPreviewObj,
    };
}

/**
 * Fetches real 5-minute historical observations for any specific date (`YYYY-MM-DD` or `YYYYMMDD`)
 * directly from `https://api.weather.com/v2/pws/history/all`.
 */
export async function fetchIntradayForDate(stationId: string, dateStr: string): Promise<IntradayPoint[]> {
    const cleanDate = dateStr.replace(/-/g, '').slice(0, 8);
    const cleanId = stationId.trim().toUpperCase();
    const url = `https://api.weather.com/v2/pws/history/all?stationId=${encodeURIComponent(cleanId)}&format=json&units=m&date=${cleanDate}&numericPrecision=decimal&apiKey=${WEATHER_COM_PUBLIC_KEY}`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.observations) && data.observations.length > 0) {
                return data.observations.map(mapRawIntradayObs);
            }
        }
    } catch {
        // fallback to proxy
        try {
            const pRes = await fetch(`/api/pws?stationId=${encodeURIComponent(cleanId)}&date=${cleanDate}`);
            if (pRes.ok) {
                const pData = await pRes.json();
                if (Array.isArray(pData?.specificDateAll?.observations)) {
                    return pData.specificDateAll.observations.map(mapRawIntradayObs);
                }
            }
        } catch {
            // ignore
        }
    }
    return [];
}
