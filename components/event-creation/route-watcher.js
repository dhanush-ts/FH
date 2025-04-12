// components/EventRouteWatcher.js
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const EventRouteWatcher = ({ onEventIdChange }) => {
  const pathname = usePathname();
  const previousEventIdRef = useRef(null);

  useEffect(() => {
    const match = pathname.match(/\/event\/create\/([^/]+)/);
    const currentEventId = match ? match[1] : null;

    if (currentEventId && previousEventIdRef.current !== currentEventId) {
      onEventIdChange(currentEventId);
      previousEventIdRef.current = currentEventId;
    }
  }, [pathname, onEventIdChange]);

  return null;
};

export default EventRouteWatcher;
