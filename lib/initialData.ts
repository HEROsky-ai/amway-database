import { DatabaseItem } from './types';

export const INITIAL_ITEMS: DatabaseItem[] = [
  {
    id: 'nut-001',
    title: 'Double X daily nutrition note',
    category: 'nutrition',
    subcategory: 'Nutrilite',
    tags: ['Double X', 'nutrition', 'daily care'],
    summary: 'A simple note for explaining Double X as a daily nutrition support product.',
    content:
      'Start from daily eating habits, busy schedules, eating out, and limited fruit and vegetable intake. Explain Double X as nutritional support, not as a medical treatment. Keep the message practical and focused on daily health management.',
    imageText: 'Double X, Nutrilite, daily nutrition, plant concentrate, vitamin and mineral support.',
    highlights: [
      'Begin with the customer lifestyle before discussing ingredients.',
      'Use steady wording such as daily support and nutritional balance.',
      'Avoid medical claims and keep the explanation easy to understand.',
    ],
    qa: [
      {
        question: 'Why use a broad nutrition supplement?',
        answer:
          'It can help support a more balanced daily routine when meals are inconsistent. It does not replace a complete diet.',
      },
      {
        question: 'Should the first explanation include every ingredient?',
        answer:
          'Usually no. Confirm the customer situation first, then explain the product position in a few clear points.',
      },
    ],
    links: [{ label: 'Amway official website', url: 'https://www.amway.com' }],
    isFavorite: true,
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'nut-002',
    title: 'Protein conversation guide',
    category: 'nutrition',
    subcategory: 'Protein',
    tags: ['protein', 'breakfast', 'fitness'],
    summary: 'A note for discussing protein intake with customers who skip breakfast or eat out often.',
    content:
      'Protein conversations are easier when tied to breakfast quality, satiety, exercise recovery, and daily routine. Ask what the customer usually eats before suggesting a supplement.',
    imageText: 'Protein powder, breakfast shake, balanced meal, active lifestyle.',
    highlights: [
      'Breakfast is the easiest use case.',
      'Connect the note to fitness, body management, or busy schedules.',
      'Do not position protein as a quick weight-loss tool.',
    ],
    qa: [
      {
        question: 'Do people who do not exercise need protein?',
        answer:
          'It depends on the diet. If daily meals do not provide enough protein, food choices or supplements may help fill the gap.',
      },
    ],
    links: [],
    isFavorite: false,
    updatedAt: '2026-08-02T11:30:00Z',
  },
  {
    id: 'wat-001',
    title: 'eSpring water purifier overview',
    category: 'water',
    subcategory: 'eSpring',
    tags: ['eSpring', 'water', 'filter'],
    summary: 'A structured note for discussing drinking water habits and eSpring use cases.',
    content:
      'Ask how the family currently drinks water, whether they boil water, buy bottled water, or care about filter replacement. Then explain convenience, long-term usage, and maintenance.',
    imageText: 'eSpring, water purifier, filter replacement, kitchen drinking water.',
    highlights: [
      'Understand the current drinking habit before introducing the product.',
      'For families, focus on convenience and maintenance routine.',
      'If cost is a concern, compare long-term use cases.',
    ],
    qa: [
      {
        question: 'How is boiling water different from using a purifier?',
        answer:
          'Boiling mainly handles heating. A purifier focuses on filtration and convenient daily drinking water, depending on the product design.',
      },
    ],
    links: [],
    isFavorite: true,
    updatedAt: '2026-08-03T14:20:00Z',
  },
  {
    id: 'wat-002',
    title: 'Filter replacement follow-up script',
    category: 'water',
    subcategory: 'Service',
    tags: ['filter', 'service', 'follow up'],
    summary: 'A note for reminding customers about filter checks without sounding like a sales message.',
    content:
      'A filter reminder is also a service moment. Ask about recent usage, water taste, family experience, and whether replacement steps are clear.',
    imageText: 'Filter reminder, replacement date, customer service, maintenance checklist.',
    highlights: [
      'Check usage before asking for replacement.',
      'Use maintenance records to build long-term service quality.',
      'Provide simple replacement steps when customers have questions.',
    ],
    qa: [],
    links: [],
    isFavorite: false,
    updatedAt: '2026-08-04T09:20:00Z',
  },
  {
    id: 'air-001',
    title: 'Air purifier need discovery',
    category: 'air',
    subcategory: 'Atmosphere',
    tags: ['air purifier', 'home', 'filter'],
    summary: 'A note for identifying customer needs around indoor air quality.',
    content:
      'Start with the home environment: allergies, pets, renovation, roadside dust, sleep quality, or odor concerns. Then explain room fit, filter care, and regular use.',
    imageText: 'Atmosphere, air purifier, HEPA filter, indoor air quality, allergy concern.',
    highlights: [
      'Home scenarios reveal needs better than specifications.',
      'Pet homes, renovation, and allergy concerns are common entry points.',
      'Discuss cleaning and filter maintenance as part of ownership.',
    ],
    qa: [
      {
        question: 'Do I still need an air purifier if I open windows?',
        answer:
          'It depends on the environment. If outdoor air quality is unstable or indoor odor is a concern, air management may still be useful.',
      },
    ],
    links: [],
    isFavorite: false,
    updatedAt: '2026-08-05T15:40:00Z',
  },
  {
    id: 'biz-001',
    title: 'New contact invitation message',
    category: 'business',
    subcategory: 'Invitation',
    tags: ['invite', 'message', 'follow up'],
    summary: 'A low-pressure message structure for inviting a new contact to talk.',
    content:
      'Keep the invitation short, specific, and low-pressure. Explain why you thought of the person, then offer a simple next step such as coffee, a 15-minute chat, or sharing a useful health note.',
    imageText: 'Invitation message, coffee chat, 15 minute talk, follow up.',
    highlights: [
      'Keep one purpose per message.',
      'Offer an easy response option.',
      'Use a sharing tone rather than a pressure tone.',
    ],
    qa: [
      {
        question: 'What if the person reads but does not reply?',
        answer:
          'Do not send repeated pressure messages. Wait a few days and follow up with a fresh point of value or a simple question.',
      },
    ],
    links: [],
    isFavorite: true,
    updatedAt: '2026-08-06T18:10:00Z',
  },
];
