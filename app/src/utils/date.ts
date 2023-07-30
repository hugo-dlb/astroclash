import { intervalToDuration, formatDuration as fnsFormatDuration } from "date-fns";

export const formatDuration = (seconds: number) => {
    const formatDistanceLocale = { xSeconds: '{{count}}s', xMinutes: '{{count}}m', xHours: '{{count}}h' } as any;
    const shortEnLocale = { formatDistance: (token: string, count: number) => formatDistanceLocale[token].replace('{{count}}', count) };
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    return fnsFormatDuration(duration, { format: ['hours', 'minutes', 'seconds'], locale: shortEnLocale });
};