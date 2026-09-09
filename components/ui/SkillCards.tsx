// Accepts both lucide-react and react-icons components
type SkillIcon = React.ComponentType<{
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}>;

interface SkillCardProps {
  name: string;
  icon: SkillIcon;
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
        
        {/* Main card with high-performance styling (no heavy backdrop-blur) */}
        <div className="relative bg-card border border-border/80 rounded-2xl p-4 w-32 h-24 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-accent/40 group-hover:shadow-xl">
          {/* Icon container */}
          <div 
            className="relative p-2 rounded-xl mb-2 transition-all duration-300 group-hover:scale-110"
            style={{ 
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              boxShadow: `0 2px 10px ${color}15`
            }}
          >
            <Icon 
              size={20} 
              className="text-foreground transition-all duration-300"
              style={{ color }}
            />
          </div>
          
          {/* Skill name with better contrast */}
          <h3 className="text-foreground font-medium text-center text-xs leading-tight tracking-wide">
            {name}
          </h3>
          
          {/* Animated underline */}
          <div 
            className="w-4 h-0.5 rounded-full mt-1.5 opacity-50 group-hover:opacity-90 group-hover:w-8 transition-all duration-300"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SkillCards;