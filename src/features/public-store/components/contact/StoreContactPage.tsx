import { Mail, MapPin, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type StoreContactPageProps = Readonly<{
  storeSlug: string;
}>;

export function StoreContactPage({ storeSlug }: StoreContactPageProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.2fr]">
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Contact</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Get in touch</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Reach out to {storeSlug} for reservations, events, or menu help.
        </p>
        <div className="mt-5 space-y-3 text-sm text-zinc-300">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-amber-300" />
            55 Main Street, New York
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-amber-300" />
            +012 (345) 678 99
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-amber-300" />
            kaffendev@gmail.com
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Send a message</h2>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Name</Label>
            <Input id="contact-name" placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" placeholder="Write your message here" />
          </div>
          <Button type="button" variant="default" size="sm" disabled>
            Submit (UI only)
          </Button>
        </div>
      </section>
    </div>
  );
}
