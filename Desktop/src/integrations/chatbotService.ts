import { propertyApi } from './propertyApi';

interface ChatResponse {
  content: string;
  type: 'text' | 'property' | 'error';
}

class ChatbotService {
  async processMessage(message: string): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Check if this is a property-related query
    if (this.isPropertyQuery(lowerMessage)) {
      return await this.handlePropertyQuery(message);
    }
    
    // Handle other types of queries
    return this.handleGeneralQuery(message);
  }
  
  private isPropertyQuery(message: string): boolean {
    const propertyKeywords = [
      'property', 'address', 'house', 'home', 'real estate',
      'price', 'value', 'zestimate', 'bedrooms', 'bathrooms',
      'sq ft', 'square feet', 'neighborhood', 'zillow'
    ];
    
    // Check if message contains an address pattern (numbers + street name)
    const addressPattern = /\d+\s+[a-zA-Z\s]+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd)/i;
    
    return propertyKeywords.some(keyword => message.includes(keyword)) || addressPattern.test(message);
  }
  
  private async handlePropertyQuery(message: string): Promise<ChatResponse> {
    try {
      // Extract address from the message
      const address = this.extractAddress(message);
      
      if (!address) {
        return {
          content: "I couldn't find a valid address in your message. Please provide a property address in one of these formats:\n\n• Full address: 123 Main Street, City, State ZIP\n• With city and state: 123 Main St, Springfield, IL\n• Basic format: 123 Main Street\n\nI'll help you find information about the property once you provide the address.",
          type: 'text'
        };
      }
      
      // Validate the extracted address
      const validation = this.validateAddress(address);
      
      if (!validation.isValid) {
        // Try to search with partial information anyway
         try {
           const searchResult = await propertyApi.searchProperties(address);
           
           if (searchResult && searchResult.results && searchResult.results.length > 0) {
             if (searchResult.results.length === 1) {
               // Single result found, return it directly
               return {
                 content: this.formatPropertyResponse(searchResult.results[0]),
                 type: 'property'
               };
             } else {
                // Multiple results found, present options
                return {
                  content: this.formatMultiplePropertiesResponse(searchResult),
                  type: 'text'
                };
              }
           }
         } catch (error) {
           console.log('Search with partial address failed:', error);
         }
        
        // If search fails or no results, ask for more info
        const missingInfo = validation.missingComponents.join(', ');
        return {
          content: `I found "${address}" but it's missing: ${missingInfo}.\n\nI tried searching but couldn't find any matches. Please provide at least:\n• Street number (e.g., 123)\n• Street name (e.g., Main Street)\n\nExample: 123 Main Street\nBetter: 123 Main Street, Springfield, IL\n\nWhat's the complete address?`,
          type: 'text'
        };
      }
      
      // If validation passes but has recommendations, show a brief note
      if (validation.missingComponents.length > 0) {
        const recommendations = validation.missingComponents.filter(comp => comp.includes('recommended'));
        if (recommendations.length > 0) {
          // Continue with search but note the recommendation
          console.log('Address validation note:', recommendations.join(', '));
        }
      }
      
      // Try search first for valid addresses to see if we can find multiple results
      try {
        const searchResult = await propertyApi.searchProperties(address);
        
        if (searchResult && searchResult.results && searchResult.results.length > 0) {
          if (searchResult.results.length === 1) {
            // Single result found, return it directly
            return {
              content: this.formatPropertyResponse(searchResult.results[0]),
              type: 'property'
            };
          } else {
            // Multiple results found, present options
            return {
              content: this.formatMultiplePropertiesResponse(searchResult),
              type: 'text'
            };
          }
        }
      } catch (error) {
        console.log('Search failed, trying single property lookup:', error);
      }
      
      // If search returns no results, try the single property API
      const propertyData = await propertyApi.getBotPropertyInfo(address);
      
      if (!propertyData || propertyData.error) {
        return {
          content: `I searched for "${address}" but couldn't find any property information. This could be because:\n\n• The property isn't currently listed for sale\n• The address format might need adjustment\n• The property data isn't available in our database\n\nTry:\n• Adding or adjusting the city, state, or ZIP code\n• Using a slightly different address format\n• Checking if the property is currently on the market\n\nWould you like to try a different address or ask me something else?`,
          type: 'text'
        };
      }
      
      // Format the response
      const formattedResponse = this.formatPropertyResponse(propertyData);
      
      return {
        content: formattedResponse,
        type: 'property'
      };
      
    } catch (error) {
      console.error('Error in property query:', error);
      return {
        content: "I encountered an error while looking up that property. Please try again with a complete address.",
        type: 'error'
      };
    }
  }
  
  private extractAddress(message: string): string | null {
    // Clean the message
    const cleanMessage = message.trim();
    
    // Multiple address patterns to handle different formats
    const addressPatterns = [
      // Full address: 123 Main St, City, State ZIP
      /\d+\s+[a-zA-Z0-9\s]+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd|crescent|cres|terrace|ter|close|grove|heights|hill|park|square|sq)[\s,]+[a-zA-Z\s]+,\s*[a-zA-Z]{2}\s+\d{5}(-\d{4})?/i,
      // Address with city and state: 123 Main St, City, State
      /\d+\s+[a-zA-Z0-9\s]+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd|crescent|cres|terrace|ter|close|grove|heights|hill|park|square|sq)[\s,]+[a-zA-Z\s]+,\s*[a-zA-Z]{2}/i,
      // Basic address with numbers and street: 123 Main Street
      /\d+\s+[a-zA-Z0-9\s]+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd|crescent|cres|terrace|ter|close|grove|heights|hill|park|square|sq)/i,
      // Any text with commas and numbers (fallback)
      /\d+[^,]*,[^,]*,[^,]*/
    ];
    
    // Try each pattern
    for (const pattern of addressPatterns) {
      const match = cleanMessage.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    
    // If message contains commas and numbers, assume it might be an address
    if (cleanMessage.includes(',') && /\d/.test(cleanMessage)) {
      return cleanMessage;
    }
    
    return null;
  }
  
  private validateAddress(address: string): { isValid: boolean; missingComponents: string[] } {
    const missingComponents: string[] = [];
    
    // Check for street number (required)
    if (!/\d+/.test(address)) {
      missingComponents.push('street number');
    }
    
    // Check for street name (required)
    if (!/[a-zA-Z]+\s*(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd|crescent|cres|terrace|ter|close|grove|heights|hill|park|square|sq)/i.test(address)) {
      missingComponents.push('street name');
    }
    
    // For basic validation, we only require street number and name
    // City, state, and ZIP are helpful but not strictly required
    const parts = address.split(',');
    
    // If there are comma-separated parts, validate them
    if (parts.length >= 2) {
      // Check for state (2-letter abbreviation) only if we have multiple parts
      if (parts.length >= 3 && !/\b[A-Z]{2}\b/i.test(address)) {
        missingComponents.push('state abbreviation');
      }
    } else {
      // If no commas, suggest adding city for better results
      if (!/\b(city|town|village)\b/i.test(address)) {
        // Only suggest city if the address seems incomplete
        const words = address.trim().split(/\s+/);
        if (words.length < 4) {
          missingComponents.push('city (recommended for better results)');
        }
      }
    }
    
    // Address is valid if it has at least street number and name
    const hasRequiredComponents = /\d+/.test(address) && 
      /[a-zA-Z]+\s*(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd|crescent|cres|terrace|ter|close|grove|heights|hill|park|square|sq)/i.test(address);
    
    return {
      isValid: hasRequiredComponents,
      missingComponents
    };
  }
  
  private handleGeneralQuery(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // Check if message contains partial address information
    const hasNumbers = /\d/.test(message);
    const hasStreetWords = /(street|st|avenue|ave|road|rd|drive|dr|lane|ln|place|pl|way|court|ct|circle|cir|boulevard|blvd)/i.test(message);
    const hasCommas = message.includes(',');
    
    if ((hasNumbers && hasStreetWords) || (hasNumbers && hasCommas)) {
      return {
        content: "It looks like you might be trying to provide an address, but I need a bit more information to help you effectively.\n\nPlease provide the address in one of these formats:\n• Complete: 123 Main Street, Springfield, IL 62701\n• With city/state: 123 Main St, Springfield, IL\n• Basic: 123 Main Street\n\nWhat property address are you looking for?",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        content: "Hello! I'm here to help you with property information. You can ask me about specific properties by providing an address, or ask general questions about real estate.",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('help')) {
      return {
        content: "I can help you with:\n\n• Property information (provide an address)\n• Market trends\n• Neighborhood details\n• Property values\n\nFor property searches, please provide addresses like:\n• 123 Main Street, Springfield, IL 62701\n• 456 Oak Ave, Chicago, IL\n\nJust ask me about any property or real estate topic!",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('follow-up') || lowerMessage.includes('lead')) {
      return {
        content: "Here's a suggested follow-up message for your lead:\n\n'Hi [Name], I hope you're doing well! I wanted to follow up on our conversation about your real estate needs. Have you had a chance to think about the properties we discussed? I'd love to schedule a time to show you some options that match your criteria. When would be a good time for you this week?'\n\nWould you like me to customize this further?",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('market trends') || lowerMessage.includes('market')) {
      return {
        content: "Current real estate market trends show:\n\n• Interest rates remain a key factor in buyer decisions\n• Inventory levels are gradually improving in most markets\n• Buyers are becoming more selective and price-conscious\n• Properties priced competitively are selling faster\n• First-time homebuyers are facing affordability challenges\n\nWould you like specific data for a particular area?",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('cold calling') || lowerMessage.includes('script')) {
      return {
        content: "Here's a cold calling script:\n\n'Hi [Name], this is [Your Name] with [Company]. I'm calling because I specialize in helping homeowners in your area, and I noticed your property might be a great fit for some buyers I'm working with. Do you have a quick minute to chat about your real estate goals?'\n\nKey tips:\n• Keep it conversational\n• Listen more than you talk\n• Focus on their needs, not your agenda\n• Always ask permission to continue",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('negotiating') || lowerMessage.includes('negotiate')) {
      return {
        content: "Negotiation tips for working with buyers:\n\n• Understand their motivation and timeline\n• Present multiple options when possible\n• Focus on value, not just price\n• Use market data to support your position\n• Stay professional and solution-focused\n• Know when to walk away\n• Always get agreements in writing\n\nRemember: The best negotiations result in win-win outcomes!",
        type: 'text'
      };
    }
    
    if (lowerMessage.includes('property description') || lowerMessage.includes('marketing')) {
      return {
        content: "Here's a template for property descriptions:\n\n'[Attention-grabbing headline]\n\nThis [property type] offers [key features] in the desirable [neighborhood] area. Featuring [bedrooms/bathrooms], [special amenities], and [unique selling points].\n\nHighlights:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\nPerfect for [target buyer type]. Schedule your showing today!'\n\nWould you like me to help you customize this for a specific property?",
        type: 'text'
      };
    }
    
    // Default response
    return {
      content: "I'm here to help with your real estate needs! I can assist with:\n\n• Property information and valuations\n• Lead follow-up suggestions\n• Market trend analysis\n• Cold calling scripts\n• Negotiation strategies\n• Marketing copy\n\nWhat would you like help with today?",
      type: 'text'
    };
  }
  
  private formatPropertyResponse(propertyData: any): string {
    let response = `Here's what I found about this property:\n\n`;
    
    if (propertyData.address) {
      response += `📍 **Address:** ${propertyData.address}\n`;
    }
    
    if (propertyData.price) {
      response += `💰 **Price:** $${propertyData.price.toLocaleString()}\n`;
    }
    
    if (propertyData.bedrooms && propertyData.bathrooms) {
      response += `🏠 **Layout:** ${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath\n`;
    }
    
    if (propertyData.square_feet) {
      response += `📐 **Size:** ${propertyData.square_feet.toLocaleString()} sq ft\n`;
    }
    
    if (propertyData.zestimate) {
      response += `📊 **Estimated Value:** $${propertyData.zestimate.toLocaleString()}\n`;
    }
    
    if (propertyData.neighborhood) {
      response += `🏘️ **Neighborhood:** ${propertyData.neighborhood}\n`;
    }
    
    response += `\nWould you like me to provide market analysis or compare this property with others in the area?`;
    
    return response;
  }
  
  private formatMultipleOptionsResponse(searchTerm: string, results: any[]): ChatResponse {
    let response = `I found multiple properties matching "${searchTerm}". Please select one:\n\n`;
    
    results.slice(0, 5).forEach((property, index) => {
      response += `${index + 1}. ${property.address}`;
      if (property.price) {
        response += ` - $${property.price.toLocaleString()}`;
      }
      if (property.bedrooms && property.bathrooms) {
        response += ` (${property.bedrooms}bd/${property.bathrooms}ba)`;
      }
      response += `\n`;
    });
    
    if (results.length > 5) {
      response += `\n... and ${results.length - 5} more results.\n`;
    }
    
    response += `\nPlease provide the complete address of the property you're interested in, or ask me about a specific one by number.`;
    
    return {
      content: response,
      type: 'text'
    };
  }
  
  private formatMultiplePropertiesResponse(searchResult: any): string {
    let response = `I found ${searchResult.total_count} properties matching "${searchResult.search_term}". Here are the options:\n\n`;
    
    searchResult.results.slice(0, 5).forEach((property: any, index: number) => {
      response += `${index + 1}. ${property.address}`;
      if (property.price) {
        response += ` - $${property.price.toLocaleString()}`;
      }
      if (property.bedrooms && property.bathrooms) {
        response += ` (${property.bedrooms}bd/${property.bathrooms}ba)`;
      }
      if (property.property_type) {
        response += ` - ${property.property_type}`;
      }
      response += `\n`;
    });
    
    if (searchResult.total_count > 5) {
      response += `\n... and ${searchResult.total_count - 5} more properties.\n`;
    }
    
    response += `\nPlease tell me which property you'd like to know more about by providing a more specific address or saying "Tell me about property 1".`;
    
    return response;
  }
}

export const chatbotService = new ChatbotService();