interface CoinCounterProps {
  coins?: number;
}

export function CoinCounter({ coins = 50 }: CoinCounterProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
      <span className="text-base">🪙</span>
      {coins}
    </div>
  );
}
