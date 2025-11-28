import * as kv from './kv_store.tsx';

// Seed some sample users for matching
export async function seedData() {
  const users = [
    {
      id: 'user-1',
      name: 'Arjun Mehta',
      campus: 'IIT Delhi',
      bio: 'Music enthusiast and data nerd',
      teachSkills: [
        { skill: 'Guitar', level: 'intermediate' },
        { skill: 'Excel', level: 'advanced' },
      ],
      learnSkills: [
        { skill: 'Python', level: 'beginner' },
        { skill: 'Video Editing', level: 'beginner' },
      ],
      availability: ['weekends', 'evenings'],
    },
    {
      id: 'user-2',
      name: 'Priya Sharma',
      campus: 'DU North Campus',
      bio: 'Creative soul learning to code',
      teachSkills: [
        { skill: 'Tarot Reading', level: 'intermediate' },
        { skill: 'Guitar', level: 'beginner' },
      ],
      learnSkills: [
        { skill: 'Python', level: 'beginner' },
      ],
      availability: ['weekday mornings'],
    },
    {
      id: 'user-3',
      name: 'Rohan Kumar',
      campus: 'IIT Delhi',
      bio: 'Tech + design',
      teachSkills: [
        { skill: 'Figma', level: 'advanced' },
      ],
      learnSkills: [
        { skill: 'Video Editing', level: 'intermediate' },
      ],
      availability: ['flexible'],
    },
    {
      id: 'user-4',
      name: 'Ananya Singh',
      campus: 'SRCC',
      bio: 'Excel wizard, guitar learner',
      teachSkills: [
        { skill: 'Excel', level: 'advanced' },
        { skill: 'Public Speaking', level: 'intermediate' },
      ],
      learnSkills: [
        { skill: 'Guitar', level: 'beginner' },
      ],
    },
  ];

  console.log('Seeding sample users...');
  for (const user of users) {
    await kv.set(`user:${user.id}`, user);
  }
  console.log('Sample users seeded successfully!');
}
