import React from 'react';
import { Clipboard, Share2 } from 'lucide-react';
import { DailyData } from '../shared/types/chart';
import { generateShareText, copyToClipboard, shareToWhatsApp } from '../shared/utils/shareUtils';

interface ActionButtonsProps {
  weeklyData: DailyData[];
  onReset: () => void;
  onShowAlert: (message: string, type: 'success' | 'error' | 'warning') => void;
}

/**
 * Action buttons for chart operations
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  weeklyData, 
  onReset, 
  onShowAlert 
}) => {
  const handleCopyToClipboard = async () => {
    const text = generateShareText(weeklyData);
    const success = await copyToClipboard(text);
    
    if (success) {
      onShowAlert("Copied to clipboard successfully!", 'success');
    } else {
      onShowAlert("Failed to copy to clipboard.", 'error');
    }
  };

  const handleShareToWhatsApp = () => {
    const text = generateShareText(weeklyData);
    shareToWhatsApp(text);
    onShowAlert("WhatsApp sharing initiated!", 'success');
  };

  return (
    <div className="flex justify-center space-x-4 mt-6 mb-8">
      <button 
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
        onClick={onReset}
        aria-label="Reset chart to initial values"
      >
        Reset
      </button>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-colors"
        onClick={handleCopyToClipboard}
        aria-label="Copy macro plan to clipboard"
      >
        <Clipboard size={18} className="mr-2"/> Copy to Clipboard
      </button>
      <button 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-colors"
        onClick={handleShareToWhatsApp}
        aria-label="Share macro plan to WhatsApp"
      >
        <Share2 size={18} className="mr-2"/> Share to WhatsApp
      </button>
    </div>
  );
}; 