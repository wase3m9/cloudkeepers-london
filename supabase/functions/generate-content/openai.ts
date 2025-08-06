import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { getPricingSection } from "./pricing.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createOpenAIClient = () => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAI({ apiKey });
};

export const generateTitle = async (openai: OpenAI, city: string, service: string) => {
  try {
    console.log(`Generating title for ${service} in ${city}`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Create a concise, SEO-optimized title for a professional accounting service page." },
        { role: "user", content: `Create a title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` }
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    return response.choices[0]?.message?.content || `${service} Services in ${city} | Professional Accountants`;
  } catch (error) {
    console.error('Error generating title:', error);
    return `${service} Services in ${city} | Professional Accountants`;
  }
};

export const generateDescription = async (openai: OpenAI, city: string, service: string) => {
  try {
    console.log(`Generating description for ${service} in ${city}`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Create an engaging meta description for a professional accounting service page." },
        { role: "user", content: `Write a meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` }
      ],
      temperature: 0.7,
      max_tokens: 160,
    });
    
    return response.choices[0]?.message?.content || `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
  } catch (error) {
    console.error('Error generating description:', error);
    return `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
  }
};

export const generateMainContent = async (openai: OpenAI, city: string, service: string, pricingSection: string) => {
  try {
    console.log(`Generating main content for ${service} in ${city}`);
    const contentPrompt = `
Create comprehensive, detailed content for ${service} services in ${city}. Target approximately 1800 words total. Follow this exact structure and formatting:

# ${service} Services in ${city}

[Write a compelling 200-word introduction about our expertise in ${service} and strong presence in ${city}. Focus on local business needs, community involvement, and how we understand the unique challenges facing businesses in ${city}. Mention our track record and commitment to helping local businesses thrive.]

## Our Expertise in ${service}

[Write a comprehensive 250-word section about our specialized knowledge in ${service}. Include specific qualifications, certifications (ACCA, ACA, CIMA), years of experience, team expertise, continuing education, and industry recognition. Mention our approach to staying current with regulations and best practices.]

## Local ${service} Services in ${city}

[Write a detailed 200-word section about our local presence and deep understanding of ${city}'s business environment. Include insights about local business trends, economic factors, common challenges businesses face in the area, and how our local knowledge benefits clients.]

## How We Help ${city} Businesses

### Comprehensive Financial Solutions
[Write about our complete range of financial services, from basic bookkeeping to complex financial restructuring]

### Industry-Specific Expertise
[Write about our experience with different business sectors: retail, hospitality, construction, professional services, e-commerce, etc.]

### Technology-Driven Approach
[Write about our use of modern accounting software like Xero, QuickBooks, Sage, cloud-based solutions, and digital transformation]

### Dedicated Support Team
[Write about our customer service, response times, and dedicated account management]

### Compliance and Regulatory Support
[Write about staying up-to-date with UK tax laws, VAT regulations, and statutory requirements]

### Strategic Business Planning
[Write about our advisory services, business planning, and growth strategies]

## Industry-Specific Solutions in ${city}

[Write a 200-word section covering how we serve different industries. Include specific examples for retail businesses, restaurants, construction companies, professional services, e-commerce, and manufacturing. Explain unique challenges and solutions for each sector.]

## Our Complete Service Portfolio

1. **Monthly Bookkeeping and Accounting**
   - Real-time cloud-based bookkeeping
   - Bank reconciliation and cash flow management
   - Purchase and sales ledger management
   - Monthly management reports and KPI dashboards

2. **Tax Planning and Compliance**
   - Corporation tax preparation and filing
   - Self-assessment for directors and sole traders
   - VAT returns and Making Tax Digital compliance
   - Tax planning strategies to minimize liabilities

3. **Business Advisory and Consulting**
   - Strategic business planning and forecasting
   - Cash flow analysis and working capital optimization
   - Business restructuring and expansion planning
   - Performance benchmarking and KPI development

4. **Financial Reporting and Analysis**
   - Annual accounts preparation and filing
   - Management accounts and board reporting
   - Budget preparation and variance analysis
   - Financial modeling and scenario planning

5. **Payroll Services**
   - Complete payroll processing and administration
   - PAYE and National Insurance calculations
   - Auto-enrolment pension compliance
   - Payroll reporting and analytics

6. **VAT and Tax Services**
   - VAT registration and compliance
   - Making Tax Digital implementation
   - Tax investigations and dispute resolution
   - R&D tax credits and other reliefs

7. **Startup and Growth Support**
   - Company formation and registration
   - Business plan development
   - Funding and investment support
   - Scaling strategies for growing businesses

8. **Compliance and Regulatory**
   - Companies House filing
   - Statutory audit coordination
   - Regulatory compliance across all sectors
   - Risk management and internal controls

## Technology and Digital Solutions

[Write a 100-word section about our technology partnerships with Xero, QuickBooks, Sage, Receipt Bank, and other fintech solutions. Explain how we leverage technology to provide efficient, accurate, and real-time financial information.]

## Why Choose Our ${service} Services in ${city}

[Write a 150-word section highlighting competitive advantages, local market knowledge, client testimonials themes, award recognition, and what sets us apart from other accounting firms in ${city}.]

${pricingSection}

## Frequently Asked Questions

### How quickly can you start working with my business?
[Write a detailed answer about onboarding process, typical timelines, what information is needed, and how we ensure smooth transitions]

### What makes your ${service} services unique in ${city}?
[Write about unique selling points, local expertise, community involvement, and personalized approach]

### Do you work with specific industries?
[Write about industry specializations, sector expertise, and examples of businesses we've helped]

### What accounting software do you use and support?
[Write about technology stack, software partnerships, training, and integration capabilities]

### How do you ensure data security and confidentiality?
[Write about security measures, compliance standards, data protection protocols, and client confidentiality]

### What level of support and communication can I expect?
[Write about communication channels, response times, regular check-ins, and accessibility]

### How do you handle Making Tax Digital and VAT compliance?
[Write about MTD expertise, software integration, compliance processes, and ongoing support]

### Can you help with business growth and expansion?
[Write about advisory services, growth planning, funding support, and scaling strategies]

### What are your fees and how do you structure pricing?
[Write about transparent pricing, value-based approach, and how pricing reflects the comprehensive service provided]

### Do you offer fixed-fee arrangements?
[Write about pricing certainty, monthly packages, and how fixed fees benefit businesses with budgeting and cash flow]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert accountant creating comprehensive, professional content for an accounting firm's website. Write detailed, valuable content that demonstrates expertise and builds trust. Use clear, professional language with specific examples and actionable insights. Format in proper markdown with clear section breaks and bullet points. Aim for approximately 1800 words total."
        },
        { role: "user", content: contentPrompt }
      ],
      temperature: 0.7,
      max_tokens: 7000,
    });

    return response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
  } catch (error) {
    console.error('Error generating main content:', error);
    return `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, service, type } = await req.json();
    console.log(`Generating content for ${city}/${service} - Type: ${type}`);

    if (!city || !service || !type) {
      throw new Error('Missing required fields: city, service, and type are required');
    }

    const openai = createOpenAIClient();

    if (type !== 'all') {
      throw new Error('Invalid content type');
    }

    const [title, description, mainContent] = await Promise.all([
      generateTitle(openai, city, service),
      generateDescription(openai, city, service),
      generateMainContent(openai, city, service, getPricingSection())
    ]);

    console.log('Successfully generated new content');
    
    return new Response(
      JSON.stringify({ title, description, mainContent }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        title: `Professional Services in Your Area | Expert Accountants`,
        description: `Expert accounting services tailored to your business needs. Contact us today for professional support.`,
        mainContent: `# Professional Accounting Services\n\nWe provide expert accounting services tailored to local businesses.\n\n${getPricingSection()}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});