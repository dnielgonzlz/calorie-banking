import { DailyData } from '../types/chart';

/**
 * Generates formatted text for sharing weekly macro plan
 */
export const generateShareText = (weeklyData: DailyData[]): string => {
  let text = "Hey coach! Here's how I'm planning my weekly macros:\n\n";
  weeklyData.forEach(day => {
    text += `${day.name}: ${day.Total.toFixed(0)} cals / ${day.Protein.toFixed(0)}P / ${day.Fats.toFixed(0)}F / ${day.Carbs.toFixed(0)}C\n`;
  });
  text += "\nLet me know if you want me to make any adjustments!";
  return text;
};

/**
 * Copies text to clipboard with proper error handling
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Could not copy text: ', error);
    return false;
  }
};

/**
 * Opens WhatsApp with pre-filled message
 */
export const shareToWhatsApp = (text: string): void => {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}; 