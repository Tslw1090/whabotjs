import { useState } from "react";
import { useMessageSender } from "@/hooks/useMessageSender";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  recipient: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must include country code (e.g. +1234567890)"),
  message: z.string().min(1, "Message is required"),
  hasMedia: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface MessageFormProps {
  onMessageSent: () => void;
}

export default function MessageForm({ onMessageSent }: MessageFormProps) {
  const { toast } = useToast();
  const { sendMessage, isPending } = useMessageSender();
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      message: "",
      hasMedia: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await sendMessage({
        phone: values.recipient,
        message: values.message,
      });
      
      form.reset();
      setShowMediaUpload(false);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      
      onMessageSent();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Recipient Phone Number</FormLabel>
              <FormControl>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input 
                    placeholder="+1234567890"
                    {...field}
                    className="focus:ring-primary focus:border-primary block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
              </FormControl>
              <p className="mt-2 text-xs text-gray-500">Enter number with country code (e.g., +1 for US)</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Type your message here..."
                  {...field}
                  rows={4}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasMedia"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setShowMediaUpload(!!checked);
                  }}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-medium text-gray-700">Include Media</FormLabel>
                <p className="text-gray-500 text-sm">Attach an image, audio, or document</p>
              </div>
            </FormItem>
          )}
        />
        
        {showMediaUpload && (
          <div className="flex justify-end">
            <div>
              <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg className="-ml-0.5 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Upload File
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isPending}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
          >
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
