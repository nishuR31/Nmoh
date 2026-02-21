import React, { useMemo } from 'react';
import { Users, Crown, MapPin, ExternalLink, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import { getTeamMembers, TeamMember } from '@/config/team';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn } from '@/lib/utils';
import { ScrollReveal, StaggerContainer } from '@/components/ui/ScrollReveal';

const SocialIcon: React.FC<{ type: string; href: string }> = ({ type, href }) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter size={18} />,
    github: <Github size={18} />,
    linkedin: <Linkedin size={18} />,
    website: <Globe size={18} />,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      aria-label={type}
    >
      {icons[type] || <ExternalLink size={18} />}
    </a>
  );
};

const TeamMemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  return (
    <div 
      className={cn(
        "glass-hover group relative rounded-2xl overflow-hidden",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Founder Badge */}
      {member.isFounder && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <Crown size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Founder</span>
          </div>
        </div>
      )}

      {/* Avatar */}
      <div className="relative h-64 overflow-hidden bg-muted/20">
        <LazyImage
          src={member.avatar || '/placeholder.svg'}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          containerClassName="h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 -mt-12 relative">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {member.name}
        </h3>
        <p className="text-primary font-medium text-sm mb-3">
          {member.role}
        </p>

        {member.location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <MapPin size={14} />
            <span>{member.location}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {member.bio}
        </p>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {member.skills.slice(0, 4).map(skill => (
              <span 
                key={skill}
                className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        {member.socials && (
          <div className="flex items-center gap-1 pt-4 border-t border-border">
            {Object.entries(member.socials).map(([type, href]) => (
              href && <SocialIcon key={type} type={type} href={href} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers = useMemo(() => getTeamMembers(), []);
  const founders = useMemo(() => teamMembers.filter(m => m.isFounder), [teamMembers]);
  const team = useMemo(() => teamMembers.filter(m => !m.isFounder), [teamMembers]);

  return (
    <div className="min-h-[80vh] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
            <Users size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet the Team
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals behind all the products. We're dedicated to 
            building tools that make a difference.
          </p>
        </ScrollReveal>

        {/* Founders Section */}
        {founders.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Crown size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Founders
                </h2>
                <p className="text-muted-foreground text-sm">
                  The visionaries who started it all
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founders.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Team Section */}
        {team.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-muted/50">
                <Users size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Team Members
                </h2>
                <p className="text-muted-foreground text-sm">
                  The talented people making it happen
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Join CTA */}
        <div className="mt-20 text-center">
          <div className="glass p-8 md:p-12 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to Join Us?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for passionate people to join our team. 
              If you're excited about building great products, we'd love to hear from you.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Get in Touch
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
