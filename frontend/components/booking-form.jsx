"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { submitBooking } from "@/lib/services/api"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  artist: z.string().optional(),
  service: z.string({ required_error: "Please select a service." }),
  date: z.date({ required_error: "Please select a date." }),
  description: z.string().min(10, { message: "Please provide more details about your tattoo idea." }),
})

export default function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Format date to ISO string for API
      const formattedValues = {
        ...values,
        date: values.date.toISOString().split('T')[0]
      }
      
      // Send booking data to API
      await submitBooking(formattedValues)
      setIsSubmitted(true)
    } catch (err) {
      setError("There was a problem submitting your booking. Please try again.")
      toast({
        title: "Booking Error",
        description: "Failed to submit booking. Please try again later.",
        variant: "destructive"
      })
      console.error("Booking submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  if (isSubmitted) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="h-8 w-8 text-green-500" />
        </motion.div>
        <motion.h3
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Booking Request Received
        </motion.h3>
        <motion.p
          className="text-gray-400 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Thank you for your booking request. We'll contact you within 24-48 hours to confirm your appointment.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            onClick={() => {
              setIsSubmitted(false)
              form.reset()
            }}
            className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white transition-all duration-300"
          >
            Submit Another Request
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {error && (
          <motion.div 
            className="bg-red-500/20 text-red-200 p-3 rounded-md border border-red-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      {...field}
                      className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      {...field}
                      className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your phone number"
                      {...field}
                      className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800/90 backdrop-blur-md border-zinc-700">
                      <SelectItem value="custom">Custom Tattoo</SelectItem>
                      <SelectItem value="coverup">Cover-Up</SelectItem>
                      <SelectItem value="blackgrey">Black & Grey</SelectItem>
                      <SelectItem value="color">Color Work</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="art">Custom Art</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Artist (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300">
                        <SelectValue placeholder="Any artist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800/90 backdrop-blur-md border-zinc-700">
                      <SelectItem value="alex">Alex Rivera</SelectItem>
                      <SelectItem value="morgan">Morgan Chen</SelectItem>
                      <SelectItem value="jamie">Jamie Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal bg-zinc-800/80 backdrop-blur-sm border-zinc-700 hover:bg-zinc-700/50 focus:border-white/50 transition-all duration-300 ${!field.value && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-zinc-800/90 backdrop-blur-md border-zinc-700"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 1}
                        initialFocus
                        className="bg-transparent"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tattoo Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your tattoo idea, including size, placement, and any reference images you have."
                    className="min-h-[120px] bg-zinc-800/80 backdrop-blur-sm border-zinc-700 focus:border-white/50 transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white transition-all duration-300"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  )
}
