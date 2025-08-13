// small summary card so i can see totals at a glance
export default function TotalsCard({
  totals,
}: {
  totals: { calories: number; protein: number; carbs: number; fat: number };
}) {
  return (
    <div className="bg-white/95 border border-sand rounded-2xl p-4 sm:p-5 grid grid-cols-4 gap-4 text-center shadow-soft backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs text-slate/70">Calories</div>
        <div className="text-2xl font-extrabold text-blue-600 drop-shadow-sm">{totals.calories}</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs text-slate/70">Protein</div>
        <div className="text-2xl font-extrabold text-green-600">{totals.protein} g</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs text-slate/70">Carbs</div>
        <div className="text-2xl font-extrabold text-orange-600">{totals.carbs} g</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs text-slate/70">Fat</div>
        <div className="text-2xl font-extrabold text-red-600">{totals.fat} g</div>
      </div>
    </div>
  );
}
