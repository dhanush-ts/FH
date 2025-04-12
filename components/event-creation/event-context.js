'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

const EventContextWrapper = ({ id,children }) => {
  const pathname = usePathname();
  const [eventId, setEventId] = useState(id);

  useEffect(() => {
    console.log(pathname)
    const match = pathname.match(/\/event\/create\/([^/]+)/);
    const currentEventId = match ? match[1] : null;

    // Check if the current event ID is different from the one in the context
    console.log(currentEventId, eventId);

    if (currentEventId && currentEventId !== eventId) {
      setEventId(currentEventId);
    }
  }, [id]);

  return (
    <EventContext.Provider value={{ eventId, setEventId }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContextWrapper;
