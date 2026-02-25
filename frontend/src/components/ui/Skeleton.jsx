export const Skeleton = ({ className = "" }) => {
  return <div className={`skeleton ${className}`.trim()} aria-hidden="true" />;
};
