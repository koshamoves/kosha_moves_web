export const generateBookingId = () => {
      return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };