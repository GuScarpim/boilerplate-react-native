/**
 * Formats a date to a localized string
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats a date to a time string
 */
export function formatTime(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date, locale: string = 'en-US'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -diffInSeconds,
      'second'
    );
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -diffInMinutes,
      'minute'
    );
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -diffInHours,
      'hour'
    );
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-diffInDays, 'day');
}

