// Decorative paw prints - static, very low opacity background texture
export function FloatingPaws() {
  const paws = [
    { top: '8%', left: '5%', size: 28, rotate: -15 },
    { top: '72%', right: '8%', size: 24, rotate: 20 },
    { top: '25%', right: '12%', size: 20, rotate: -30 },
    { bottom: '15%', left: '10%', size: 22, rotate: 10 },
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {paws.map((paw, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            bottom: paw.bottom,
            opacity: 0.03 + (i * 0.005),
          }}
        >
          <img
            src="/logo_pata.avif"
            alt=""
            style={{
              width: paw.size,
              height: paw.size,
              transform: `rotate(${paw.rotate}deg)`,
              filter: 'grayscale(0.5)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
