import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'

export function LeadForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    companySize: '',
    serviceInterest: '',
    currentSoftware: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, save to Supabase
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          website: formData.website,
          company_size: formData.companySize,
          service_interest: formData.serviceInterest,
          current_software: formData.currentSoftware
        }])

      if (dbError) {
        console.error('Supabase error:', dbError)
        throw dbError
      }

      // Then, send email notification
      const { error: emailError } = await supabase.functions.invoke('send-lead-notification', {
        body: formData
      })

      if (emailError) {
        console.error('Email notification error:', emailError)
        // Don't throw here - we still want to show success since the lead was saved
      }

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      })

      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        website: '',
        companySize: '',
        serviceInterest: '',
        currentSoftware: ''
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="lead-form" onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6">Get Your FREE Consultation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          required
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          required
        />
      </div>
      
      <Input
        type="email"
        placeholder="Business Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      
      <Input
        type="url"
        placeholder="Company Website"
        value={formData.website}
        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
      />

      <select
        className="w-full p-2 border rounded"
        value={formData.companySize}
        onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
        required
      >
        <option value="">Company Size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201+">201+ employees</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={formData.serviceInterest}
        onChange={(e) => setFormData(prev => ({ ...prev, serviceInterest: e.target.value }))}
        required
      >
        <option value="">Service Interest</option>
        <option value="accounting">Accounting</option>
        <option value="tax-planning">Tax Planning</option>
        <option value="bookkeeping">Bookkeeping</option>
        <option value="payroll">Payroll</option>
        <option value="advisory">Business Advisory</option>
      </select>

      <select
        className="w-full p-2 border rounded"
        value={formData.currentSoftware}
        onChange={(e) => setFormData(prev => ({ ...prev, currentSoftware: e.target.value }))}
      >
        <option value="">Current Accounting Software</option>
        <option value="xero">Xero</option>
        <option value="quickbooks">QuickBooks</option>
        <option value="sage">Sage</option>
        <option value="other">Other</option>
        <option value="none">None</option>
      </select>

      <Button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Get Free Consultation"}
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this form, you agree to our privacy policy and terms of service.
      </p>
    </form>
  )
}