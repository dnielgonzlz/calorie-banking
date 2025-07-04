import { useState, useCallback } from 'react';
import { AlertState } from '../../shared/types/chart';
import { ALERT_DURATION } from '../../shared/constants/nutrition';

/**
 * Custom hook for managing alert state and auto-dismiss functionality
 */
export const useAlerts = () => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((message: string, type: AlertState['type']) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), ALERT_DURATION);
  }, []);

  const dismissAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    dismissAlert
  };
}; 