// @ts-nocheck
export const formatDuration = (duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  // Build an array to hold the pieces of the duration string
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  // Join the parts together; if none, return '0s'
  return parts.length > 0 ? parts.join(" ") : null;
};
