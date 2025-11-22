import dayjs from 'dayjs';

export default function PunchCard({ card }) {
  const today = dayjs().format('YYYY-MM-DD');
  const punchedToday = card.punchedDates.includes(today);

  return (
    <div className="border rounded-xl p-4 bg-white shadow max-w-xs mx-auto">
      <img src={card.imageUrl} alt="Card Art" className="rounded mb-2 w-full h-32 object-cover" />
      <h2 className="text-xl font-semibold">{card.name}</h2>
      <p className="text-sm text-gray-600">{card.description}</p>
      <div className="mt-2 flex gap-2 justify-center">
        {Array.from({ length: card.totalSlots || 7 }).map((_, i) => (
          <span key={i} className="text-2xl">
            {card.punchedDates[i] ? card.icon1 || '🌸' : ' '}
          </span>
        ))}
      </div>
      <p className="text-center mt-2 text-sm">
        {punchedToday ? '✅ Punched today!' : '🔲 Not punched yet'}
      </p>
    </div>
  );
}
