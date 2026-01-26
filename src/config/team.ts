/**
 * Team/Founders Configuration
 * 
 * Config-driven team data for the founders page.
 */

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  location?: string;
  socials?: SocialLinks;
  skills?: string[];
  isFounder?: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'founder-1',
    name: 'Alex Chen',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with 10+ years of experience building scalable web applications. Passionate about creating tools that empower developers and streamline workflows.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    location: 'San Francisco, CA',
    socials: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
    skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    isFounder: true,
  },
  {
    id: 'founder-2',
    name: 'Sarah Mitchell',
    role: 'Co-Founder & Product Designer',
    bio: 'UX/UI designer focused on creating intuitive and beautiful user experiences. Believes great design should be invisible and functional.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    location: 'New York, NY',
    socials: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
    skills: ['UI/UX Design', 'Figma', 'Brand Strategy', 'Motion Design'],
    isFounder: true,
  },
  {
    id: 'team-1',
    name: 'Marcus Johnson',
    role: 'Backend Engineer',
    bio: 'Infrastructure specialist with a focus on building reliable and performant APIs. Previously worked at major tech companies on distributed systems.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    location: 'Austin, TX',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    skills: ['Python', 'PostgreSQL', 'AWS', 'Kubernetes'],
    isFounder: false,
  },
  {
    id: 'team-2',
    name: 'Emily Park',
    role: 'Frontend Developer',
    bio: 'React enthusiast who loves crafting pixel-perfect interfaces. Advocate for accessibility and performance optimization.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    location: 'Seattle, WA',
    socials: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
    skills: ['React', 'CSS', 'Animation', 'Accessibility'],
    isFounder: false,
  },
];

// Data access functions
export const getTeamMembers = (): TeamMember[] => teamMembers;

export const getFounders = (): TeamMember[] => 
  teamMembers.filter(m => m.isFounder);

export const getTeamMemberById = (id: string): TeamMember | undefined =>
  teamMembers.find(m => m.id === id);
