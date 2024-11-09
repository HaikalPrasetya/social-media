import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps {
  onBottomReached: () => void;
  children: React.ReactNode;
  className?: string;
}

function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "40px",
    onChange: (inView) => {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}

export default InfiniteScrollContainer;
