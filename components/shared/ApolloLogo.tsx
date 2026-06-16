export function ApolloLogo({ className = "", variant = "default" }: { className?: string, variant?: "default" | "white" }) {
  const isWhite = variant === "white";
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`font-outfit font-bold text-xl ${isWhite ? "text-white" : "text-apollo"}`}>apollo</span>
      <span className={`font-outfit font-light text-xl ${isWhite ? "text-white" : "text-apollo-light"}`}>tyres</span>
      <span className={`ml-1 font-outfit font-semibold text-sm px-2 py-0.5 rounded-full ${isWhite ? "bg-white/20 text-white" : "text-text-secondary bg-apollo-muted"}`}>
        learn
      </span>
    </div>
  );
}
