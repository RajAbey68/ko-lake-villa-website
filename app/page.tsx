import Hero from '@/components/landing/Hero';

export const metadata = {
  title: 'Ko Lake Villa | Luxury Lakefront Accommodation',
  description: 'Relax, Revive, Reconnect — Book direct and save 10–15%.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[conic-gradient(at_10%_10%,#431407_10%,#7c2d12_40%,#1f2937_60%,#431407_90%)]/5">
      <Hero />
    </main>
  );
}