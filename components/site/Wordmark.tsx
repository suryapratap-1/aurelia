/** AURELIA, with the first A drawn by hand: its crossbar is a door-swing arc from the plan. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span role="img" className={`inline-flex items-baseline font-display tracking-[0.14em] ${className}`} aria-label="Aurelia">
      <svg viewBox="0 0 100 100" className="mr-[0.06em] h-[0.72em] w-[0.74em] self-baseline overflow-visible" aria-hidden="true">
        <path d="M50 2 L6 100" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="square" />
        <path d="M50 2 L95 100" stroke="currentColor" strokeWidth="13" fill="none" strokeLinecap="square" />
        <path d="M-6 100 H18 M80 100 H108" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* the swing: hinge on the left leg, leaf open along the leg, arc to the right leg */}
        <path d="M22 66 A 54 54 0 0 1 76 66" stroke="currentColor" strokeWidth="3.4" fill="none" transform="translate(0 -4)" />
      </svg>
      <span aria-hidden="true">URELIA</span>
    </span>
  );
}
