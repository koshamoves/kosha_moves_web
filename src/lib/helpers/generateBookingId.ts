export const generateBookingId = (): string => {
  return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};