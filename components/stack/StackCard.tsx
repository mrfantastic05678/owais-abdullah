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
      className={`group relative block rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-[#081B1E] ${
        featured
          ? 'border-teal-500/40 dark:border-teal-500/40 shadow-sm hover:border-teal-500 hover:shadow-lg hover:-translate-y-0.5'
          : 'border-slate-200/90 dark:border-[#10343A] shadow-xs hover:border-teal-500/50 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${
        featured
          ? 'bg-gradient-to-r from-transparent via-teal-500 to-transparent'
          : 'bg-gradient-to-r from-transparent via-slate-200 dark:via-[#10343A] to-transparent group-hover:via-teal-500/50'
      } transition-all duration-300`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo / Initial */}
          <div className="relative shrink-0">
            {tool.logo?.asset?.url ? (
              <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#05181b] border border-slate-200/70 dark:border-[#10343A] p-2 transition-all duration-300 group-hover:scale-105 shadow-2xs">
                <Image
                  src={tool.logo.asset.url}
                  alt={`${tool.name} logo`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-lg transition-all duration-300 group-hover:border-teal-500 shadow-2xs">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 truncate">
                {tool.name}
              </h3>
              {tool.featured && (
                <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  ESSENTIAL
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {tool.tagline}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#05181b] text-slate-700 dark:text-teal-200 border border-slate-200/80 dark:border-[#10343A]">
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
