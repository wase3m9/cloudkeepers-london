import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'

interface GetStartedSectionProps {
  city: string;
  service: string;
  niches: Array<{ name: string; slug: string }>;
}

export function GetStartedSection({ city, service, niches }: GetStartedSectionProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    monthlyBudget: '',
    interestedServices: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          website: formData.companyName,
          service_interest: formData.interestedServices.join(', ')
        }])

      if (error) throw error

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      })

      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phone: '',
        monthlyBudget: '',
        interestedServices: []
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

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      interestedServices: prev.interestedServices.includes(service)
        ? prev.interestedServices.filter(s => s !== service)
        : [...prev.interestedServices, service]
    }))
  }

  return (
    <div className="bg-blue-600 py-8 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-white mb-6">
          Transform your business with our {service} services in {city}.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            required
          />
          
          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
          
          <Input
            type="text"
            placeholder="Monthly Budget"
            value={formData.monthlyBudget}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
            required
          />
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Services Interested In:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {niches.map((niche) => (
                <div key={niche.slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={niche.slug}
                    checked={formData.interestedServices.includes(niche.slug)}
                    onCheckedChange={() => toggleService(niche.slug)}
                  />
                  <label
                    htmlFor={niche.slug}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {niche.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Get Started Today"}
          </Button>
        </form>
      </div>
    </div>
  )
}