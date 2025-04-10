"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/app/api";

export function MediaDetailsForm({ initialData, eventId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const initialDataRef = useRef(false);
  const form = useForm({
    defaultValues: {
      banner: null,
      about_event: initialData?.about_event || "",
      mode: initialData?.mode || "Online",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : new Date(),
      end_date: initialData?.end_date
        ? new Date(initialData.end_date)
        : new Date(),
      registration_end_date: initialData?.registration_end_date
        ? new Date(initialData.registration_end_date)
        : new Date(),
    },
  });

  useEffect(() => {
    if (initialData?.banner && !bannerPreview) {
      setBannerPreview(initialData.banner);
    }
  }, [initialData, bannerPreview]);

  useEffect(() => {
    if (initialData && !initialDataRef.current) {
      const data = {
        about_event: initialData.about_event || "",
        mode: initialData.mode || "Online",
        start_date: initialData.start_date
          ? new Date(initialData.start_date)
          : new Date(),
        end_date: initialData.end_date
          ? new Date(initialData.end_date)
          : new Date(),
        registration_end_date: initialData.registration_end_date
          ? new Date(initialData.registration_end_date)
          : new Date(),
        banner: initialData.banner || null,
      };
      setOriginalData(data);
      // Assuming setSectionData is passed as a prop
      // setSectionData("media", data);
      initialDataRef.current = true;
    }
  }, [initialData /*, setSectionData */]);

  const handleFileUpload = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
    setBannerFile(file);
    form.setValue("banner", file);
  };

  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      formData.append("about_event", data.about_event);
      formData.append("mode", data.mode);
      formData.append("start_date", data.start_date.toISOString().split("T")[0]);
      formData.append("end_date", data.end_date.toISOString().split("T")[0]);
      formData.append(
        "registration_end_date",
        data.registration_end_date.toISOString().split("T")[0]
      );

      const isInitialDataEmpty =
        !initialData?.about_event &&
        !initialData?.mode &&
        !initialData?.start_date &&
        !initialData?.end_date &&
        !initialData?.registration_end_date &&
        !initialData?.banner;

      const method = isInitialDataEmpty ? "PUT" : "PATCH";
      const url = `/event/organizer/base-event-detail/${eventId}/`;

      const response = await fetchWithAuth(url, {
        method,
        body: formData,
      });
      const savedData = await response.json();
      console.log(savedData)

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }


      const updatedData = {
        ...data,
        banner: bannerPreview,
      };
      setOriginalData(updatedData);

      router.push(`/host/create/${eventId}/sponsors`);
    } catch (error) {
      console.error("Error saving media details:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Upload */}
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Banner</FormLabel>
                <FormControl>
                  <div className="relative w-48 h-24 border-dashed border-2 border-gray-400 rounded-md flex items-center justify-center overflow-hidden">
                    {bannerPreview ? (
                      <Image src={bannerPreview} alt="Banner Preview" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-500" />
                        <span className="text-sm text-gray-500">Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0]);
                          field.onChange(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </FormControl>
                <FormDescription>Upload an image to represent your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* About Event */}
          <FormField
            control={form.control}
            name="about_event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About the Event</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell people more about your event..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Mode */}
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Event Mode</FormLabel>
                <FormControl>
                  <RadioGroup defaultValue={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Offline" id="offline" />
                      <Label htmlFor="offline">Offline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Hybrid" id="hybrid" />
                      <Label htmlFor="hybrid">Hybrid</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date, End Date */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Registration End Date */}
          <FormField
            control={form.control}
            name="registration_end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Registration End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/host/create/${eventId}/additional`)}
            >
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}