"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useState, useMemo } from "react";

function generateTimeSlots() {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({ time, available: true }); // You can add logic for availability here
    }
  }
  return slots;
}

function Picker() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(null);
  const [search, setSearch] = useState("");

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const filteredSlots = useMemo(
    () =>
      timeSlots.filter(({ time }) =>
        time.toLowerCase().includes(search.toLowerCase())
      ),
    [search, timeSlots]
  );

  return (
    <div>
      <div className="rounded-lg border border-border">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setTime(null);
              }
            }}
            className="p-2 sm:pe-5 bg-background"
            disabled={[{ before: today }]}
          />
          <div className="relative w-full max-sm:h-64 sm:w-40">
            <div className="absolute inset-0 border-border py-4 max-sm:border-t">
              <ScrollArea className="h-full border-border sm:border-s">
                <div className="space-y-3 px-4">
                  <Input
                    placeholder="Search time (e.g. 13:15)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex h-5 shrink-0 items-center">
                    <p className="text-sm font-medium">{format(date, "EEEE, d")}</p>
                  </div>
                  <div className="grid gap-1.5 max-sm:grid-cols-2">
                    {filteredSlots.length > 0 ? (
                      filteredSlots.map(({ time: timeSlot, available }) => (
                        <Button
                          key={timeSlot}
                          variant={time === timeSlot ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setTime(timeSlot)}
                          disabled={!available}
                        >
                          {timeSlot}
                        </Button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No matching time slots.</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      <p
        className="mt-4 text-center text-xs text-muted-foreground"
        role="region"
        aria-live="polite"
      >
        Appointment picker -{" "}
        <a
          className="underline hover:text-foreground"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  );
}

export { Picker };
