import type { ProjectFilter } from '@/types/project';
import { cn } from '@/utils/cn';

const filters: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'completed', label: 'Completed' },
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'upcoming', label: 'Upcoming' },
];

interface ProjectFiltersProps {
  activeFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
}

export function ProjectFilters({ activeFilter, onFilterChange }: ProjectFiltersProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap"
      role="tablist"
      aria-label="Filter projects"
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          role="tab"
          aria-selected={activeFilter === filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'shrink-0 px-4 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors',
            activeFilter === filter.value
              ? 'bg-charcoal text-white'
              : 'bg-stone text-warm-gray hover:text-charcoal',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
