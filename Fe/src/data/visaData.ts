export interface VisaCountry {
  id: string;
  name: string;
  flag: string;
  type: 'e-visa' | 'stamped';
  price?: string;
  processingTime: string;
  validity: string;
  biometric: 'Required' | 'Not Required' | 'No' | 'Yes';
  entryType?: string;
  stayPeriod?: string;
  description?: string;
  requirements: string[];
  importantNotes: string[];
  terms: string[];
  faqs: { question: string; answer: string }[];
  region?: string;
}

export const eVisaDestinations: VisaCountry[] = [
  {
    id: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    type: 'e-visa',
    price: '₹2,999',
    processingTime: '3–5 Working Days',
    validity: '30 Days',
    biometric: 'Not Required',
    requirements: [
      'Passport (6 months validity)',
      'Recent passport-size photograph',
      'Flight booking',
      'Hotel booking',
      'Bank statement',
      'Cover letter'
    ],
    importantNotes: [
      'Visa approval is subject to immigration authority discretion.',
      'Processing time may vary during peak seasons.'
    ],
    terms: [
      'Visa fees are non-refundable once submitted.',
      'Additional documents may be requested by authorities.'
    ],
    faqs: [
      {
        question: 'Can I apply online?',
        answer: 'Yes, Singapore tourist visas can be processed online.'
      },
      {
        question: 'Is hotel booking mandatory?',
        answer: 'Yes, confirmed accommodation details are usually required.'
      }
    ]
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    flag: '🇻🇳',
    type: 'e-visa',
    price: '₹2,499',
    processingTime: '3–4 Working Days',
    validity: '30 Days',
    biometric: 'Not Required',
    requirements: [
      'Passport (6 months validity)',
      'Recent passport-size photograph (white background)',
      'Flight booking details'
    ],
    importantNotes: [
      'The e-Visa is valid for a single entry.',
      'Print your e-Visa to present at the port of entry.'
    ],
    terms: [
      'Visa fees are non-refundable once submitted.'
    ],
    faqs: [
      {
        question: 'How long is the Vietnam e-Visa valid for?',
        answer: 'The e-Visa is valid for a maximum of 30 days, single entry.'
      }
    ]
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    type: 'e-visa',
    price: '₹4,999',
    processingTime: '5–7 Working Days',
    validity: '90 Days',
    biometric: 'Not Required',
    requirements: [
      'Passport (6 months validity)',
      'Recent passport-size photographs',
      'Confirmed flight tickets',
      'Confirmed hotel bookings',
      'Last 6 months bank statement',
      'Income Tax Returns (last 3 years)'
    ],
    importantNotes: [
      'E-visa is applicable for short-term tourism purposes only.'
    ],
    terms: [
      'Visa fees are non-refundable.'
    ],
    faqs: [
      {
        question: 'Can I get a multiple entry visa?',
        answer: 'Multiple entry visas have different requirements and are usually stamped visas.'
      }
    ]
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    type: 'e-visa',
    price: '₹2,199',
    processingTime: '2–4 Working Days',
    validity: '30 Days',
    biometric: 'Not Required',
    requirements: [
      'Passport with at least 6 months validity',
      'Recent studio photo',
      'Confirmed return flight ticket',
      'Proof of accommodation'
    ],
    importantNotes: [
      'Ensure all uploaded documents are clear and readable.'
    ],
    terms: [
      'Fees are strictly non-refundable.'
    ],
    faqs: [
      {
        question: 'Do Indian citizens need a visa for Malaysia?',
        answer: 'Indian citizens currently enjoy visa-free entry for up to 30 days, subject to filling the MDAC form. E-visa applies for specific long-term requirements or different nationalities.'
      }
    ]
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    flag: '🇰🇭',
    type: 'e-visa',
    price: '₹2,799',
    processingTime: '3–5 Working Days',
    validity: '90 Days',
    biometric: 'No',
    entryType: 'Single Entry',
    stayPeriod: '30 Days',
    description: 'Planning a trip to Cambodia? Indian passport holders must obtain a Cambodia Tourist e-Visa before traveling. Whether you\'re visiting the iconic Angkor Wat, exploring vibrant cities, or enjoying a relaxing holiday, the e-Visa offers a simple and convenient way to enter Cambodia for tourism. The application requires a valid passport, recent passport-size photograph, accommodation details, and other supporting documents. The visa is typically processed within 3–5 working days, making it an ideal choice for holiday travelers. At Dyna Tours India, we provide end-to-end Cambodia visa assistance, including document verification, application support, and timely updates to ensure a smooth and hassle-free visa process. Before applying, check the latest visa requirements, processing time, and validity to plan your trip with confidence.',
    requirements: [
      'Scanned colour copy of first and last page of your Passport',
      'Scanned recent colour passport size photograph with white background'
    ],
    importantNotes: [
      'E-visa is valid only at selected entry points.'
    ],
    terms: [
      'Visa approval or refusal is the sole discretion of the Embassy/Consulate',
      'Visa fee is non-refundable',
      'Providing wrong information will lead to refusal'
    ],
    faqs: [
      {
        question: 'Do Indians need a visa to visit Cambodia?',
        answer: 'Yes. Indian passport holders require a valid visa to enter Cambodia for tourism.'
      },
      {
        question: 'Can I apply online for a Cambodia visa?',
        answer: 'Yes. Eligible travelers can apply for a Cambodia Tourist e-Visa online.'
      },
      {
        question: 'How long does it take to process the visa?',
        answer: 'Normally, the processing time is 3–5 working days, subject to approval.'
      },
      {
        question: 'Is biometric verification required?',
        answer: 'No. Biometric verification is generally not required for the Cambodia Tourist e-Visa.'
      },
      {
        question: 'How long can I stay in Cambodia?',
        answer: 'The Tourist e-Visa allows a stay of up to 30 days.'
      }
    ]
  }
];

export const schengenCountries: Partial<VisaCountry>[] = [
  { id: 'france', name: 'France', flag: '🇫🇷', price: '₹7,500' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', price: '₹7,500' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', price: '₹7,500' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', price: '₹7,500' },
  { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', price: '₹7,500' },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', price: '₹7,500' },
  { id: 'belgium', name: 'Belgium', flag: '🇧🇪', price: '₹7,500' },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', price: '₹7,500' }
];

export const otherCountries: Partial<VisaCountry>[] = [
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', price: '₹12,000' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', price: '₹14,500' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', price: '₹11,000' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', price: '₹10,500' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', price: '₹3,500' },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', price: '₹4,000' },
  { id: 'china', name: 'China', flag: '🇨🇳', price: '₹4,500' },
  { id: 'uae', name: 'UAE', flag: '🇦🇪', price: '₹6,500' }
];

export const generalFaqs = [
  {
    question: 'How long does an e-Visa take?',
    answer: 'Typically 3–7 working days depending on the destination country.'
  },
  {
    question: 'Do I need biometric enrolment?',
    answer: 'Some countries require biometric enrolment for stamped visas.'
  },
  {
    question: 'Can Dyna Tours help with documentation?',
    answer: 'Yes, we provide complete documentation assistance.'
  }
];
