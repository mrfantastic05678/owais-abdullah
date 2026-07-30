// components/stack/StackCard.tsx
import { ToolReview } from '@/types/stack'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  tool: ToolReview
  featured?: boolean
}

const RATING_COLORS: Record<number, string> = {
  5: 'text-signal-500',
  4: 'text-accent',
  3: 'text-yellow-500',
  2: 'text-orange-500',
  1: 'text-destructive',
}

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-bold tabular-nums ${RATING_COLORS[rating] || 'text-muted-foreground'}`}>
        {rating}
      </span>
      <span className="text-xs text-muted-foreground">/5</span>
      <div className="flex gap-0.5 ml-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i < rating ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function StackCard({ tool, featured = false }: Props) {
  return (
    <Link
      href={`/stack/${tool.slug.current}`}
      className={`group relative block rounded-xl border transition-all duration-300 overflow-hidden ${
        featured
          ? 'border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/40 hover:shadow-[0_0_30px_-10px] hover:shadow-accent/20'
          : 'border-border bg-card/50 hover:border-accent/30 hover:shadow-[0_0_30px_-10px] hover:shadow-accent/10'
      }`}
    >
      {/* Subtle top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${
        featured
          ? 'bg-gradient-to-r from-transparent via-accent/50 to-transparent'
          : 'bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-accent/30'
      } transition-all duration-300`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo / Initial */}
          <div className="relative shrink-0">
            {tool.logo?.asset?.url ? (
              <div className="relative w-12 h-12 rounded-lg bg-secondary/50 p-2 transition-all duration-300 group-hover:bg-secondary group-hover:scale-105">
                <Image
                  src={tool.logo.asset.url}
                  alt={`${tool.name} logo`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 flex items-center justify-center text-accent font-bold text-lg transition-all duration-300 group-hover:border-accent/30 group-hover:from-accent/30">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                {tool.name}
              </h3>
              {tool.featured && (
                <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                  ESSENTIAL
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {tool.tagline}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border">
                {tool.stackLayer}
              </span>
              {tool.projectsUsingIt && tool.projectsUsingIt.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {tool.projectsUsingIt.slice(0, 2).join(' · ')}
                  {tool.projectsUsingIt.length > 2 && ` +${tool.projectsUsingIt.length - 2}`}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="shrink-0">
            <RatingDots rating={tool.myRating} />
          </div>
        </div>
      </div>
    </Link>
  )
}
