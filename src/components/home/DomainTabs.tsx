import { useDomains } from '@/hooks/useDomains';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface DomainTabsProps {
  selectedDomainId: string | null;
  onSelect: (domainId: string | null) => void;
}

export function DomainTabs({ selectedDomainId, onSelect }: DomainTabsProps) {
  const { data: domains, isLoading } = useDomains();

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 bg-secondary/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selectedDomainId === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(null)}
          className={cn(
            "uppercase font-semibold tracking-wider text-xs",
            selectedDomainId === null && "glow-primary"
          )}
        >
          All
        </Button>
        {domains?.map((domain) => (
          <Button
            key={domain.id}
            variant={selectedDomainId === domain.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(domain.id)}
            className={cn(
              "uppercase font-semibold tracking-wider text-xs",
              selectedDomainId === domain.id && "glow-primary"
            )}
          >
            {domain.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
