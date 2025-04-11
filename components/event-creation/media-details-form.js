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
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/app/api";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";

export function MediaDetailsForm({ initialData, eventId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [editorState, setEditorState] = useState(() => {
    if (initialData?.about_event) {
      const blocksFromHtml = htmlToDraft(initialData.about_event);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });
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
  
  function getChangedFields(currentData, aboutHtml) {
    const changed = {};
    if (!originalData) return currentData;

    if (aboutHtml !== originalData.about_event) {
      changed.about_event = aboutHtml;
    }
    if (currentData.mode !== originalData.mode) {
      changed.mode = currentData.mode;
    }
    if (
      currentData.start_date &&
      originalData.start_date &&
      currentData.start_date.toISOString() !== new Date(originalData.start_date).toISOString()
    ) {
      changed.start_date = currentData.start_date;
    }
    if (
      currentData.end_date &&
      originalData.end_date &&
      currentData.end_date.toISOString() !== new Date(originalData.end_date).toISOString()
    ) {
      changed.end_date = currentData.end_date;
    }
    if (
      currentData.registration_end_date &&
      originalData.registration_end_date &&
      currentData.registration_end_date.toISOString() !== new Date(originalData.registration_end_date).toISOString()
    ) {
      changed.registration_end_date = currentData.registration_end_date;
    }
    if (bannerFile) {
      changed.banner = bannerFile;
    }
    return changed;
  }
  
  

  async function onSubmit(data) {
    setIsSubmitting(true);
    const aboutHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    try {
      const changedFields = getChangedFields(data, aboutHtml);
      const isInitialDataEmpty = Object.keys(changedFields).length === 0;

      if (isInitialDataEmpty) {
        router.push(`/host/create/${eventId}/sponsors`);
        setIsSubmitting(false);
        return;
      }

      const method = originalData ? "PATCH" : "POST";
      const url = `/event/host/base-event-detail/${eventId}/`;

      let body, isMultipart;

      if ("banner" in changedFields) {
        const formData = new FormData();
        if (bannerFile) formData.append("banner", bannerFile);
        if ("about_event" in changedFields) formData.append("about_event", aboutHtml);
        if ("mode" in changedFields) formData.append("mode", changedFields.mode);
        if ("start_date" in changedFields) formData.append("start_date", changedFields.start_date.toISOString());
        if ("end_date" in changedFields) formData.append("end_date", changedFields.end_date.toISOString());
        if ("registration_end_date" in changedFields) formData.append("registration_end_date", changedFields.registration_end_date.toISOString());

        body = formData;
        isMultipart = true;
      } else {
        const jsonPayload = {};
        if ("about_event" in changedFields) jsonPayload.about_event = aboutHtml;
        if ("mode" in changedFields) jsonPayload.mode = changedFields.mode;
        if ("start_date" in changedFields) jsonPayload.start_date = changedFields.start_date.toISOString();
        if ("end_date" in changedFields) jsonPayload.end_date = changedFields.end_date.toISOString();
        if ("registration_end_date" in changedFields) jsonPayload.registration_end_date = changedFields.registration_end_date.toISOString();

        body = JSON.stringify(jsonPayload);
        isMultipart = false;
      }

      const response = await fetchWithAuth(url, { method, body }, isMultipart);
      const text = await response.text();
      try {
        const savedData = JSON.parse(text);
        console.log(savedData);
      } catch (e) {
        console.warn("Non-JSON response:", text);
      }

      if (!response.ok) throw new Error(`Failed to save: ${response.status}`);

      const updatedData = {
        ...originalData,
        ...changedFields,
        about_event: aboutHtml,
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
          <div className="flex flex-col md:flex-row justify-between">
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

          {/* Event Mode */}
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="mb-8 w-xs mt-8 md:mt-0 space-y-4 md:flex md:flex-col md:justify-center md:item-center">
                <FormLabel className="md:mx-auto">Event Mode</FormLabel>
                <FormControl className="h-2 md:mx-auto">
                  <RadioGroup defaultValue={field.value} onValueChange={field.onChange}>
                    <div className="flex space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex space-x-2">
                      <RadioGroupItem value="Offline" id="offline" />
                      <Label htmlFor="offline">Offline</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

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

            {/* <FormField
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
            /> */}

<div>
            <FormLabel>About the Event</FormLabel>
            <div className="border border-input bg-background rounded-md p-2 min-h-[200px]">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                toolbar={{
                  options: ['inline', 'list', 'link', 'textAlign', 'history'],
                }}
              />
            </div>
            <FormDescription>Give attendees more details about your event.</FormDescription>
          </div>

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