/**
 * Instantaneous ("right now") physics for the /clients live tree.
 *
 * Uses exactly the same constants as the annual yield engine in `cvutPhysics.ts`
 * (Hellmann shear α = 0.28 from the mast height, ANSYS D150 cP at λ_opt, η_el = 0.88,
 * crown wake factor η_array, PR 0.86 × η_canopy for the solar leaves), so the live readout
 * and the PDF numbers can never disagree on method.
 */
import { CVUT_EXPERIMENTAL_CURVES, TREETINO_SYSTEM_SPECS } from './cvutPhysics';
import type { TreetinoSystemId } from './cvutPhysics';
import type { IntradayPoint, StationTelemetryBundle } from './pwsData';

export const SHEAR_ALPHA = 0.28;
export const EL_EFF = 0.88;
/** Hub gust above which the canopy rolls into storm stow (visual only) */
export const STOW_GUST_MS = 20;

const RAD = Math.PI / 180;

/* ------------------------------------------------------------------ */
/* Sun                                                                 */
/* ------------------------------------------------------------------ */

export interface SunPosition {
    /** Degrees from north, clockwise (90 = east) */
    azimuthDeg: number;
    /** Degrees above the horizon */
    elevationDeg: number;
}

/** Low-precision solar position (≈ 0.3°), good for 1950–2050 */
export function sunPosition(date: Date, lat: number, lon: number): SunPosition {
    const n = date.getTime() / 86_400_000 + 2440587.5 - 2451545.0;
    const L = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * RAD;
    const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
    const eps = (23.439 - 0.0000004 * n) * RAD;
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
    const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
    const gmstH = (18.697374558 + 24.06570982441908 * n) % 24;
    const H = (gmstH * 15 + lon) * RAD - ra;
    const phi = lat * RAD;

    const el = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    const az = Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(H));

    return { azimuthDeg: ((az / RAD) % 360 + 360) % 360, elevationDeg: el / RAD };
}

/** Haurwitz clear-sky global horizontal irradiance (W/m²) */
export function clearSkyGhi(elevationDeg: number): number {
    const cz = Math.sin(elevationDeg * RAD);

    if (cz <= 0.01) {
        return 0;
    }

    return 1098 * cz * Math.exp(-0.059 / cz);
}

/**
 * Typical ratio of measured to clear-sky irradiation in Czechia per month (Jan…Dec).
 * Turns the clear-sky ceiling into an expected value when the pyranometer channel is off.
 */
export const CZ_MONTHLY_CLEARNESS = [0.34, 0.42, 0.5, 0.56, 0.58, 0.6, 0.62, 0.62, 0.56, 0.46, 0.34, 0.3];

/* ------------------------------------------------------------------ */
/* Instantaneous output of one offered configuration                   */
/* ------------------------------------------------------------------ */

export interface LiveSample {
    epoch: number;
    windMs: number;
    gustMs: number;
    windFromDeg: number;
    tempC: number;
    pressureHpa: number;
    /** Measured irradiance; 0 when the pyranometer channel is inactive */
    solarWm2: number;
}

export interface LiveOutput {
    hubWindMs: number;
    hubGustMs: number;
    rpm: number;
    belowCutIn: boolean;
    windKw: number;
    solarKw: number;
    totalKw: number;
    ratedKw: number;
    sun: SunPosition;
    irradianceWm2: number;
    solarSource: 'measured' | 'typical-sky';
    storm: boolean;
    rho: number;
}

export function mastReferenceHeight(bundle: StationTelemetryBundle): number {
    // Same rule as cvutPhysics: the M-Kovo courtyard sensor sits in a sheltered 1.55 m layer
    if (bundle.identity.stationId === 'D3882832837') {
        return 1.55;
    }

    return Math.max(1.0, bundle.identity.mastHeightM || 1.524);
}

export function computeLiveOutput(
    bundle: StationTelemetryBundle,
    systemId: TreetinoSystemId,
    quantity: number,
    hubHeightM: number,
    sample: LiveSample,
): LiveOutput {
    const sys = TREETINO_SYSTEM_SPECS[systemId];
    const curve = CVUT_EXPERIMENTAL_CURVES[0];
    const shear = Math.pow(hubHeightM / mastReferenceHeight(bundle), SHEAR_ALPHA);
    const hubWindMs = sample.windMs * shear;
    const hubGustMs = sample.gustMs * shear;

    const rho = (Math.max(900, sample.pressureHpa || 1013) * 100) / (287.05 * (sample.tempC + 273.15));
    const area = sys.totalSweptAreaPerUnitM2 * quantity;
    const ratedWindKw = sys.nominalWindKw * quantity;
    const belowCutIn = hubWindMs < sys.cutInMs;

    const rawKw = (0.5 * rho * area * Math.pow(hubWindMs, 3) * curve.cpMax * EL_EFF * sys.arrayWakeEfficiency) / 1000;
    const windKw = belowCutIn ? 0 : Math.min(ratedWindKw, rawKw);

    // ω = λ · v / R at the ANSYS optimum λ = 1.0; free-wheeling below cut-in at a fraction of it
    const radius = sys.rotorDiameterM / 2;
    const omega = (curve.lambdaOpt * hubWindMs) / radius;
    const rpm = (omega * 60) / (2 * Math.PI) * (belowCutIn ? 0.35 : 1);

    const date = new Date(sample.epoch * 1000);
    const sun = sunPosition(date, bundle.identity.lat, bundle.identity.lon);
    const measured = sample.solarWm2 > 0;
    const clearness = CZ_MONTHLY_CLEARNESS[new Date(sample.epoch * 1000).getUTCMonth()] ?? 0.5;
    const irradianceWm2 = measured ? sample.solarWm2 : clearSkyGhi(sun.elevationDeg) * clearness;
    const kwp = sys.nominalSolarKwp * quantity;
    const tempFactor = 1 - 0.0034 * (sample.tempC - 25);
    const solarKw = kwp * (irradianceWm2 / 1000) * 0.86 * sys.solarCanopyFactor * tempFactor;

    return {
        hubWindMs,
        hubGustMs,
        rpm,
        belowCutIn,
        windKw,
        solarKw: Math.max(0, solarKw),
        totalKw: windKw + Math.max(0, solarKw),
        ratedKw: sys.nominalTotalKw * quantity,
        sun,
        irradianceWm2,
        solarSource: measured ? 'measured' : 'typical-sky',
        storm: hubGustMs >= STOW_GUST_MS,
        rho,
    };
}

export function sampleFromCurrent(c: StationTelemetryBundle['current']): LiveSample {
    return {
        epoch: c.epoch,
        windMs: c.windspeedMs,
        gustMs: c.windgustMs,
        windFromDeg: c.winddirDeg,
        tempC: c.tempC,
        pressureHpa: c.pressureHpa,
        solarWm2: c.solarRadiationWm2,
    };
}

/** Linear interpolation of an intraday series at an arbitrary epoch (clamped to the series) */
export function sampleFromIntraday(points: IntradayPoint[], epoch: number): LiveSample | null {
    if (!points.length) {
        return null;
    }

    let i = points.findIndex((p) => p.epoch >= epoch);

    if (i === -1) {
        i = points.length - 1;
    }

    const b = points[i];
    const a = points[Math.max(0, i - 1)];
    const span = b.epoch - a.epoch || 1;
    const k = Math.min(1, Math.max(0, (epoch - a.epoch) / span));
    const lerp = (x: number, y: number) => x + (y - x) * k;
    // Shortest-path interpolation of the wind direction
    const d = ((b.winddirAvg - a.winddirAvg + 540) % 360) - 180;

    return {
        epoch,
        windMs: lerp(a.windspeedAvgMs, b.windspeedAvgMs),
        gustMs: lerp(a.windgustHighMs, b.windgustHighMs),
        windFromDeg: (a.winddirAvg + d * k + 360) % 360,
        tempC: lerp(a.tempAvgC, b.tempAvgC),
        pressureHpa: lerp((a.pressureMaxHpa + a.pressureMinHpa) / 2, (b.pressureMaxHpa + b.pressureMinHpa) / 2),
        solarWm2: lerp(a.solarRadiationHigh, b.solarRadiationHigh),
    };
}

/** Wall-clock HH:MM in Europe/Prague for an epoch */
export function pragueTime(epoch: number): string {
    return new Date(epoch * 1000).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Prague' });
}
