import { Button } from '@/components/ui/button';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={onPrevious}>
        Previous
      </Button>
      <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={onNext}>
        Next
      </Button>
    </div>
  );
};
