/**
 * Generates the acronym of a full name, limited to 2 letters.
 * @param {string} fullName - The full name to generate the acronym for.
 * @return {string} The acronym of the full name.
 */
export const generateAcronym = (fullName: string): string => {
      if (!fullName) return '';

      const words = fullName.split(' ');
      let acronym = '';

      for (let i = 0; i < words.length && acronym.length < 2; i++) {
        if (words[i]) {
          acronym += words[i][0].toUpperCase();
        }
      }

      return acronym.toUpperCase();
    };