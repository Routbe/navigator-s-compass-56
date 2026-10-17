import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileDisplayPrefs } from "@/lib/profile-display";

interface Props {
  prefs: ProfileDisplayPrefs;
  onPrefChange: <K extends keyof ProfileDisplayPrefs>(key: K, value: ProfileDisplayPrefs[K]) => void;
  displayName: string | null;
  bio: string | null;
  /** Publieke handle; bepaalt de automatisch gegenereerde preview-kaart. */
  handle?: string;
}

/**
 * Meta title, description and share image, with a link-preview mock-up.
 * Zonder eigen overrides maakt ROUT automatisch een unieke kaart per lid
 * (/api/public/og/<handle>.png) op basis van profielnaam, bio en profielfoto.
 */
export function ShareInspector({ prefs, onPrefChange, displayName, bio, handle }: Props) {
  const autoImage = handle ? `https://rout.be/api/public/og/${encodeURIComponent(handle)}.png` : null;
  const previewImage = prefs.ogImageUrl?.trim() || autoImage;
  const autoTitle = `${displayName?.trim() || "Jouw profiel"}${handle ? ` (@${handle})` : ""} — ROUT`;
  return (
        <section className="space-y-2">
          <p className="text-xs font-medium">Social share inspecteur</p>
          <p className="text-[11px] text-muted-foreground">
            ROUT maakt automatisch een unieke preview-afbeelding en -tekst op basis van je profiel.
            Vul hieronder eigen waarden in om die te overschrijven.
          </p>
          <Input
            id="coach-meta-title"
            value={prefs.metaTitle ?? ""}
            maxLength={70}
            placeholder={autoTitle}
            aria-label="Meta titel"
            onChange={(e) => onPrefChange("metaTitle", e.target.value || null)}
            className="h-9 text-xs"
          />
          <Textarea
            value={prefs.metaDescription ?? ""}
            maxLength={200}
            placeholder={bio?.trim() || "Automatisch uit je tagline en bio"}
            aria-label="Meta omschrijving"
            onChange={(e) => onPrefChange("metaDescription", e.target.value || null)}
            className="min-h-16 text-xs"
          />
          <Input
            value={prefs.ogImageUrl ?? ""}
            placeholder="Eigen afbeelding (https://…) — leeg = automatische ROUT-kaart"
            aria-label="OpenGraph afbeelding"
            spellCheck={false}
            onChange={(e) => onPrefChange("ogImageUrl", e.target.value || null)}
            className="h-9 text-xs"
          />
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-[1.91/1] w-full bg-muted">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-medium">
                {prefs.metaTitle || autoTitle}
              </p>
              <p className="line-clamp-2 text-[11px] text-muted-foreground">
                {prefs.metaDescription || bio || "Voeg een omschrijving toe voor WhatsApp en LinkedIn."}
              </p>
              {!prefs.ogImageUrl && autoImage && (
                <p className="text-[10px] text-muted-foreground">Afbeelding: automatisch gegenereerd</p>
              )}
            </div>
          </div>
        </section>
  );
}
