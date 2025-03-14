// lib/dummyData.ts
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  isRemote: boolean;
  commitment: {
    hoursPerWeek: number;
    isFlexible: boolean;
    isRecurring: boolean;
  };
  categories: string[];
  skills: string[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  website?: string;
  firstStep: string;
}

export function getDummyOpportunities(): Opportunity[] {
  return [
    {
      id: "1",
      title: "Soup Kitchen Helper",
      organization: "Community Food Bank",
      description:
        "Help prepare and serve meals to those in need. Responsibilities include food preparation, serving meals, and cleanup. No experience necessary, just a willingness to help.",
      location: {
        address: "123 Main St",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        coordinates: {
          latitude: 45.5152,
          longitude: -122.6784,
        },
      },
      isRemote: false,
      commitment: {
        hoursPerWeek: 5,
        isFlexible: true,
        isRecurring: true,
      },
      categories: ["Food Security", "Community Service"],
      skills: ["Cooking", "Customer Service"],
      contactInfo: {
        name: "Jane Smith",
        email: "jane@foodbank.org",
        phone: "503-555-1234",
      },
      website: "https://communityfoodbank.org",
      firstStep:
        "Fill out our volunteer form and attend a brief orientation session.",
    },
    {
      id: "2",
      title: "Online Tutor",
      organization: "Education For All",
      description:
        "Provide online tutoring to K-12 students in math, science, or language arts. Help students understand concepts, complete homework, and prepare for exams.",
      location: {
        address: "Virtual",
        city: "Anywhere",
        state: "US",
        zipCode: "00000",
      },
      isRemote: true,
      commitment: {
        hoursPerWeek: 3,
        isFlexible: true,
        isRecurring: true,
      },
      categories: ["Education", "Mentoring", "Youth Development"],
      skills: ["Teaching", "Subject Expertise", "Patience"],
      contactInfo: {
        name: "Michael Johnson",
        email: "volunteer@educationforall.org",
      },
      website: "https://educationforall.org",
      firstStep:
        "Complete our online application and background check. Once approved, you'll be matched with students based on your expertise and availability.",
    },
    {
      id: "3",
      title: "Trail Maintenance Volunteer",
      organization: "Nature Preservers",
      description:
        "Help maintain hiking trails in local parks and nature preserves. Activities include clearing brush, repairing trail surfaces, and removing invasive plants.",
      location: {
        address: "Various Parks",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
      },
      isRemote: false,
      commitment: {
        hoursPerWeek: 4,
        isFlexible: false,
        isRecurring: true,
      },
      categories: ["Environment", "Conservation", "Outdoors"],
      skills: ["Physical Labor", "Gardening", "Outdoor Skills"],
      contactInfo: {
        name: "Robert Chen",
        email: "volunteer@naturepreservers.org",
        phone: "206-555-8765",
      },
      website: "https://naturepreservers.org",
      firstStep:
        "Sign up for a scheduled work party on our website. Wear sturdy shoes and weather-appropriate clothing. Tools and training provided.",
    },
    // Add more dummy opportunities as needed
  ];
}

export function getOpportunityById(id: string): Opportunity | undefined {
  return getDummyOpportunities().find((opportunity) => opportunity.id === id);
}
