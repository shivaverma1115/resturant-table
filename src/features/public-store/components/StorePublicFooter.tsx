import { Mail, MapPin, Phone } from "lucide-react";

import { PRODUCT } from "@/lib/constants";

const FOOTER_GALLERY = [
  "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=260&q=80",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=260&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=260&q=80",
  "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=260&q=80",
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=260&q=80",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=260&q=80",
] as const;

export function StorePublicFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[#05090f] text-zinc-200">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <section>
          <p className="text-3xl font-semibold tracking-tight text-amber-300">{PRODUCT.NAME}</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-100">Working Hours</h3>
          <div className="space-y-1 text-sm text-zinc-400">
            <p>Sunday - Thursday</p>
            <p>08:00 am - 09:00 pm</p>
          </div>
          <div className="space-y-1 text-sm text-zinc-400">
            <p>Only Friday</p>
            <p>03:00 pm - 09:00 pm</p>
          </div>
          <p className="text-sm font-medium text-amber-300">Saturday close</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-100">Contact Us</h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" />
              <span>55 Main Street, New York</span>
            </p>
            <p className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-amber-300" />
              <span>kaffendev@gmail.com</span>
            </p>
            <p className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-amber-300" />
              <span>+012 (345) 678 99</span>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-100">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {FOOTER_GALLERY.map((imageUrl, idx) => (
              <img
                key={`footer-gallery-${idx}`}
                src={imageUrl}
                alt="Coffee gallery"
                className="aspect-square w-full rounded-sm border border-zinc-800 object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-zinc-400 sm:px-6">
          © 2025 {PRODUCT.NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
