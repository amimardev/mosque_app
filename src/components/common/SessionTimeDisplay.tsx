import React, { useState, useEffect, useMemo } from 'react';
import { 
  calculateSessionDisplayTime, getAlgeriaPrayerTimes, 
  PrayerTimings, SessionDisplayTimeResult 
} from '../../lib/prayerTimes';

/**
 * Custom React Hook to get calculated display time for any session/group entry
 */
export function useSessionTimeDisplay(entry: any): SessionDisplayTimeResult {
  const [timings, setTimings] = useState<PrayerTimings | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    getAlgeriaPrayerTimes().then(data => {
      if (isMounted && data?.timings) {
        setTimings(data.timings);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return useMemo(() => {
    return calculateSessionDisplayTime(entry, timings);
  }, [entry, timings]);
}

interface SessionTimeDisplayProps {
  entry: any;
  className?: string;
  format?: 'full' | 'slot' | '12h' | 'description';
}

/**
 * Universal Reusable Component to calculate and display the time of any session / group entry
 * using real AlAdhan API prayer timings for Algeria.
 */
export const SessionTimeDisplay: React.FC<SessionTimeDisplayProps> = ({
  entry,
  className = '',
  format = 'full'
}) => {
  const result = useSessionTimeDisplay(entry);

  let text = result.displayText;
  if (format === 'slot') text = result.timeSlot;
  if (format === '12h') text = result.formatted12h;
  if (format === 'description') text = result.arabicDescription;

  const fallback = entry?.studyTime || entry?.sessionTimeText || entry?.timeSlot || '';

  return (
    <span className={className}>
      {text || fallback}
    </span>
  );
};
