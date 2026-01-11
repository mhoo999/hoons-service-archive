'use client'

interface CoffeeSelectorProps {
  count: number
  onCountChange: (count: number) => void
}

export default function CoffeeSelector({
  count,
  onCountChange,
}: CoffeeSelectorProps) {
  const coffeePrice = 5000
  const totalPrice = count * coffeePrice

  const handleDecrease = () => {
    if (count > 1) {
      onCountChange(count - 1)
    }
  }

  const handleIncrease = () => {
    onCountChange(count + 1)
  }

  return (
    <div
      className="text-center p-6 flex-shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="flex justify-center items-center gap-3 mb-4">
        <div className="text-4xl lg:text-5xl">☕</div>
        <div className="text-2xl lg:text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
          × {count}
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mb-4">
        <button
          className="w-12 h-12 border flex items-center justify-center text-xl font-medium transition-all rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: count <= 1 ? 'var(--border)' : 'var(--border)',
            backgroundColor: count <= 1 ? 'var(--background)' : 'var(--surface)',
            color: count <= 1 ? 'var(--muted)' : 'var(--foreground)'
          }}
          onClick={handleDecrease}
          disabled={count <= 1}
          aria-label="커피 개수 감소"
          onMouseEnter={(e) => {
            if (count > 1) {
              e.currentTarget.style.backgroundColor = 'var(--foreground)'
              e.currentTarget.style.color = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--foreground)'
            }
          }}
          onMouseLeave={(e) => {
            if (count > 1) {
              e.currentTarget.style.backgroundColor = 'var(--surface)'
              e.currentTarget.style.color = 'var(--foreground)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }
          }}
        >
          −
        </button>
        <span className="text-3xl lg:text-4xl font-semibold min-w-[50px]" style={{ color: 'var(--foreground)' }}>
          {count}
        </span>
        <button
          className="w-12 h-12 border flex items-center justify-center text-xl font-medium transition-all rounded-lg"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--foreground)'
          }}
          onClick={handleIncrease}
          aria-label="커피 개수 증가"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--foreground)'
            e.currentTarget.style.color = 'var(--surface)'
            e.currentTarget.style.borderColor = 'var(--foreground)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface)'
            e.currentTarget.style.color = 'var(--foreground)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          +
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          총 금액
        </span>
        <span className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          {totalPrice.toLocaleString()}원
        </span>
      </div>
    </div>
  )
}
