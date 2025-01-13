import OpenAI from "https://esm.sh/openai@4.20.1";

export const createOpenAIClient = () => {
  return new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });
};

export const generateTitle = async (openai: OpenAI, city: string, service: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "Create a concise, SEO-optimized title for a professional accounting service page." 
      },
      { 
        role: "user", 
        content: `Create a title for ${service} services in ${city}. Include location and service type. Keep it under 60 characters.` 
      }
    ],
    temperature: 0.7,
  });
  
  return response.choices[0]?.message?.content || `${service} Services in ${city} | Professional Accountants`;
};

export const generateDescription = async (openai: OpenAI, city: string, service: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: "Create an engaging meta description for a professional accounting service page." 
      },
      { 
        role: "user", 
        content: `Write a meta description for ${service} services in ${city}. Highlight key benefits and include a call to action. Keep it under 160 characters.` 
      }
    ],
    temperature: 0.7,
  });
  
  return response.choices[0]?.message?.content || `Expert ${service} services in ${city}. Contact us today for professional accounting support.`;
};

export const generateMainContent = async (openai: OpenAI, city: string, service: string, pricingSection: string) => {
  const systemPrompt = `You are an expert accountant creating content for a professional accounting firm's website. 
    Create comprehensive, engaging content that demonstrates expertise and authority. 
    Focus on location-specific benefits and challenges.
    Use a professional yet approachable tone.`;

  const contentPrompt = `Create comprehensive content about ${service} services in ${city}. Include:

    1. A compelling title that mentions ${city} and ${service}
    2. A detailed overview of our ${service} services tailored to ${city} businesses
    3. Specific benefits for ${city} businesses
    4. Common challenges faced by ${city} businesses and how we solve them
    5. Our process and approach
    6. A strong call to action

    Use this structure:

    # [Title]

    ## Overview of Our ${service} Services in ${city}
    [2-3 paragraphs about our services and their importance for local businesses]

    ## Why Choose Our ${service} Services in ${city}?
    - [3-4 key benefits, each with a brief explanation]

    ## Common ${service} Challenges for ${city} Businesses
    [2-3 specific challenges and our solutions]

    ## Our ${service} Process in ${city}
    1. [Initial consultation]
    2. [Assessment and planning]
    3. [Implementation]
    4. [Ongoing support]

    ${pricingSection}

    ## Get Started with Professional ${service} Services in ${city}
    [Compelling call to action]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: contentPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  return response.choices[0]?.message?.content || `# ${service} Services in ${city}\n\nWe provide expert ${service} services tailored to ${city} businesses.`;
};