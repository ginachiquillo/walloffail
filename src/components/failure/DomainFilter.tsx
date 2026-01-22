import { Button } from '@/components/ui/button';
import { useDomains } from '@/hooks/useDomains';
import { Skeleton } from '@/components/ui/skeleton';

interface DomainFilterProps {
  selectedDomainId: string | null;
  onSelect: (domainId: string | null) => void;
}

export function DomainFilter({ selectedDomainId, onSelect }: DomainFilterProps) {
  const { data: domains, isLoading } = useDomains();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedDomainId === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {domains?.map((domain) => (
        <Button
          key={domain.id}
          variant={selectedDomainId === domain.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(domain.id)}
        >
          {domain.name}
        </Button>
      ))}
    </div>
  );
}
