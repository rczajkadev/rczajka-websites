type ResultsSummaryProps = {
  totalResults: number;
  currentPage: number;
  totalPages: number;
};

export const ResultsSummary = ({ totalResults, currentPage, totalPages }: ResultsSummaryProps) => {
  return (
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-500">
      <span>{totalResults} results</span>
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};
