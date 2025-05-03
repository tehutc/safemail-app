/**
 * Format an email date for display in the email list
 * For today's emails, show the time (e.g., "2:30 PM")
 * For emails from this year, show the short date (e.g., "May 15")
 * For older emails, include the year (e.g., "May 15, 2023")
 */
export const formatEmailDate = (date: Date | string, detailed = false): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const isThisYear = dateObj.getFullYear() === now.getFullYear();
  
  if (detailed) {
    // Format for detailed view: "Mon, May 15, 2023, 2:30 PM"
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(dateObj);
  }
  
  if (isToday) {
    // Format for today: "2:30 PM"
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(dateObj);
  } else if (isThisYear) {
    // Format for this year: "May 15"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  } else {
    // Format for older dates: "May 15, 2023"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  }
};