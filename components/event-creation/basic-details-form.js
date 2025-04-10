'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { fetchWithAuth } from '@/app/api';
import { getChangedFields } from './utility';

export function BasicDetailsForm({ initialData, eventId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store initial data in a ref to persist original values
  const originalDataRef = useRef({
    title: initialData?.title || '',
    short_description: initialData?.short_description || '',
  });

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      short_description: initialData?.short_description || '',
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);

    const changes = getChangedFields(originalDataRef.current, data);
    if (Object.keys(changes).length === 0) {
      setIsSubmitting(false);
      router.push(`/host/create/${eventId}/additional`);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `/event/organizer/base-event/${eventId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(changes),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      await response.json();
      router.push(`/host/create/${eventId}/additional`);
    } catch (error) {
      console.error('Error saving basic details:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormDescription>
                  A clear, concise name for your event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="short_description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe your event"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  A short summary that will appear in event listings (max 200
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/host/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}