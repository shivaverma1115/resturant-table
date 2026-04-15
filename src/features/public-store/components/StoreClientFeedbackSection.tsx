import { Star } from "lucide-react";

type Testimonial = Readonly<{
  id: string;
  name: string;
  role: string;
  city: string;
  text: string;
  avatarUrl: string;
}>;

const TESTIMONIALS: Testimonial[] = [
  {
    id: "frederick-1",
    name: "Frederick S. France",
    role: "Web Designer",
    city: "Paris",
    text: "The coffee quality and table service are excellent. Every visit feels warm, clean, and premium.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "james",
    name: "James M. London",
    role: "Lawyer",
    city: "London",
    text: "Fast order flow, great atmosphere, and consistent flavor. Perfect place for client meetings and breaks.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "olivia",
    name: "Olivia D. New York",
    role: "Dentist",
    city: "New York",
    text: "Loved the staff behavior and smooth ordering. The drinks are beautifully presented and taste amazing.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "frederick-2",
    name: "Frederick S. France",
    role: "Web Designer",
    city: "Paris",
    text: "The menu variety and service speed are outstanding. This store keeps quality high across every order.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
];

export function StoreClientFeedbackSection() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Customer feedback</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5 text-center"
            >
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="mx-auto size-14 rounded-full border-2 border-zinc-700 object-cover"
                loading="lazy"
              />

              <div className="mt-3 flex items-center justify-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={`${item.id}-${i}`} className="size-3.5 fill-current" />
                ))}
              </div>

              <p className="mt-3 text-sm leading-7 text-zinc-300">{item.text}</p>
              <p className="mt-4 text-base font-semibold text-zinc-100">{item.name}</p>
              <p className="text-xs text-zinc-400">
                {item.role} · {item.city}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
