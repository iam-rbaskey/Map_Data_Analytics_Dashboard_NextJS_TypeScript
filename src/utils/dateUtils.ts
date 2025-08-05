
import { subDays, addHours, addDays, addWeeks, format, startOfDay } from 'date-fns';
import type { TimeUnit } from '@/store/useTimelineStore';

const BASE_DATE = startOfDay(subDays(new Date(), 15));
const TOTAL_DAYS = 30;

export const getStep = (unit: TimeUnit) => {
    switch (unit) {
        case 'week': return 24 * 7;
        case 'day': return 24;
        case 'hour': return 1;
        default: return 1;
    }
}

export const getTotalSteps = (unit: TimeUnit) => {
    switch (unit) {
        case 'week': return Math.floor(TOTAL_DAYS / 7);
        case 'day': return TOTAL_DAYS;
        case 'hour': return TOTAL_DAYS * 24;
        default: return TOTAL_DAYS * 24;
    }
}

export const formatLabel = (value: number, unit: TimeUnit): { label: string, startDate: Date } => {
    const stepHours = getStep(unit);
    const date = addHours(BASE_DATE, value * stepHours);
    
    let labelFormat = "MMM d, HH:00";
    if (unit === 'day') labelFormat = 'MMM d';
    if (unit === 'week') labelFormat = 'MMM d';
    
    return { label: format(date, labelFormat), startDate: date };
};


export const formatRangeLabel = (range: [number, number], unit: TimeUnit) => {
    const { label: startLabel, startDate: start } = formatLabel(range[0], unit);
    const { label: endLabel, startDate: end } = formatLabel(range[1], unit);

    if (unit === 'week') {
        const endDate = addDays(end, 6);
        return `${startLabel} - ${format(endDate, 'MMM d')}`;
    }

    if (range[0] === range[1]) {
        return startLabel;
    }

    return `${startLabel} → ${endLabel}`;
};
