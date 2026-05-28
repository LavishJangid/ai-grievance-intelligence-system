export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          key={index}
          className="particle-dot absolute h-2 w-2 rounded-full bg-cyan-300/30"
          style={{
            top: `${(index * 17) % 100}%`,
            left: `${(index * 23) % 100}%`,
            animationDelay: `${index * 0.3}s`,
            animationDuration: `${7 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  )
}
