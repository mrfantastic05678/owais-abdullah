import { LucideIcon } from 'lucide-react';

interface SkillCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
}

const SkillCards = ({ name, icon: Icon, color }: SkillCardProps) => {
  return (
    <div className="flex-shrink-0 mx-3 group cursor-pointer">
      <div className="relative">
        {/* Enhanced hover glow effect */}
        <div 
          className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-60 transition-all duration-500 blur-xl"
          style={{ 
            background: `radial-gradient(circle, ${color}80, ${color}40, transparent 70%)`
          }}
        ></div>
        
        {/* Main card with enhanced styling */}
        <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 w-32 h-24 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-card/90 group-hover:border-accent/30 group-hover:shadow-2xl">
          {/* Icon container with enhanced glow */}
          <div 
            className="relative p-2 rounded-xl mb-2 transition-all duration-300 group-hover:scale-110"
            style={{ 
              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
              boxShadow: `0 4px 20px ${color}25, inset 0 1px 0 ${color}40`
            }}
          >
            <Icon 
              size={20} 
              className="text-foreground transition-all duration-300"
              style={{ 
                filter: `drop-shadow(0 0 8px ${color}80)`,
                color: color
              }}
            />
          </div>
          
          {/* Skill name with better contrast */}
          <h3 className="text-foreground font-medium text-center text-xs leading-tight tracking-wide">
            {name}
          </h3>
          
          {/* Enhanced animated underline */}
          <div 
            className="w-4 h-0.5 rounded-full mt-1.5 opacity-50 group-hover:opacity-90 group-hover:w-8 transition-all duration-300"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              boxShadow: `0 0 10px ${color}60`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SkillCards;