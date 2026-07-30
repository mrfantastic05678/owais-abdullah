'use client'

// components/stack/StackFilter.tsx
import { ToolReview } from '@/types/stack'
import { StackCard } from './StackCard'
import { useState, useMemo } from 'react'
import { STACK_CATEGORIES } from '@/types/stack'

interface Props {
  categories: string[]
  tools: ToolReview[]
}

export function StackFilter({ categories, tools }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.stackLayer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [tools, selectedCategory, searchQuery])

  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    STACK_CATEGORIES.forEach((cat) => {
      labels[cat.value] = cat.label
    })
    return labels
  }, [])

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`h-8 px-3 rounded-md text-xs font-medium transition-all duration-200 border ${
              selectedCategory === 'all'
                ? 'bg-accent text-accent-foreground border-accent'
                : 'bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground'
            }`}
          >
            All
            <span className="ml-1.5 text-[10px] opacity-60">{tools.length}</span>
          </button>
          {categories.map((category) => {
            const count = tools.filter((t) => t.category === category).length
            const label = categoryLabels[category] || category
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-8 px-3 rounded-md text-xs font-medium transition-all duration-200 border ${
                  selectedCategory === category
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground'
                }`}
              >
                {label}
                <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs text-muted-foreground font-mono">
        {filteredTools.length === tools.length ? (
          <span>{tools.length} tools</span>
        ) : (
          <span>{filteredTools.length} of {tools.length}</span>
        )}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-3">
          {filteredTools.map((tool) => (
            <StackCard key={tool._id} tool={tool} featured={tool.featured} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-border bg-card/30">
          <p className="text-muted-foreground mb-4">No tools found.</p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
