import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, FileDown, ImageDown, Nfc, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { downloadCardPdf, downloadCardPng, type CardInput } from "@/lib/business-card";
import { joinNfcWaitlist } from "@/lib/nfc-waitlist.functions";
import { cn } from "@/lib/utils";
import { DEFAULT_PROFILE_QR_STYLE, profileQrSvg, type ProfileQrStyle } from "@/lib/profile-qr";

type Props = {
  url: string;
  handle: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  /** Shows the NFC teaser (Studio only — needs a signed-in member). */
  showNfc?: boolean;
  /** Saved profile QR style (display_prefs.qrSettings). */
  qrStyle?: ProfileQrStyle | null;
  className?: string;
  style?: React.CSSProperties;
};

/** "Deel" menu: copy link, QR, business card (PNG/PDF) and the NFC waitlist teaser. */
export function ShareMenu({ url, handle, name, bio, avatarUrl, showNfc, qrStyle, className, style }: Props) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [nfcOpen, setNfcOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const qs = qrStyle ?? DEFAULT_PROFILE_QR_STYLE;
  const svg = useMemo(() => profileQrSvg(url, qs, { size: 512 }), [url, qs]);
  const svgSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const qrDataUrl = () => qrRef.current?.toDataURL("image/png") ?? "";
  const card = (): CardInput => ({ name: name || `@${handle}`, handle, bio: bio ?? "", url, avatarUrl, qrDataUrl: qrDataUrl() });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link gekopieerd");
    } catch {
      toast.error("Kopiëren lukte niet");
    }
  };
  const downloadQr = () => {
    const a = document.createElement("a");
    a.href = svgSrc;
    a.download = `${handle || "rout"}-qr.svg`;
    a.click();
  };
  const downloadQrPng = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl();
    a.download = `${handle || "rout"}-qr.png`;
    a.click();
  };
  const run = (fn: () => Promise<void>) => () =>
    void fn().catch(() => toast.error("Genereren mislukt"));

  return (
    <>
      <QRCodeCanvas ref={qrRef} value={url} size={480} marginSize={2} fgColor={qs.fgColor} bgColor={qs.bgColor} className="hidden" aria-hidden />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn("inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium transition-colors hover:bg-muted", className)}
            style={style}
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden /> Deel
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onSelect={() => setQrOpen(true)} className="justify-center p-3" aria-label="Toon QR-code op volledig scherm">
            <img src={svgSrc} alt={`QR-code voor ${handle}`} className="h-28 w-28 rounded-lg" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => void copy()}>
            <Copy className="mr-2 h-4 w-4" aria-hidden /> Kopieer link
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={downloadQrPng}>
            <QrCode className="mr-2 h-4 w-4" aria-hidden /> Download QR-code
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={run(() => downloadCardPng(card()))}>
            <ImageDown className="mr-2 h-4 w-4" aria-hidden /> Visitekaartje als afbeelding
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={run(() => downloadCardPdf(card()))}>
            <FileDown className="mr-2 h-4 w-4" aria-hidden /> Visitekaartje als PDF
          </DropdownMenuItem>
          {showNfc && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setNfcOpen(true)} className="font-medium">
                <Nfc className="mr-2 h-4 w-4" aria-hidden /> Bestel NFC Visitekaartje
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {showNfc && <NfcDialog open={nfcOpen} onOpenChange={setNfcOpen} />}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="flex max-h-[100dvh] w-[100vw] max-w-[100vw] flex-col items-center justify-center gap-4 border-0 sm:max-w-[min(90vw,90vh)] sm:rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>QR-code</DialogTitle>
            <DialogDescription>Scan om het profiel van @{handle} te openen.</DialogDescription>
          </DialogHeader>
          <img src={svgSrc} alt={`QR-code voor ${handle}`} className="aspect-square w-full max-w-[min(90vw,80dvh)] rounded-xl" />
          <p className="text-sm font-medium">@{handle}</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={downloadQrPng}>PNG</Button>
            <Button type="button" variant="outline" onClick={downloadQr}>SVG</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const MATERIALS = [
  { id: "wood", label: "Hout" },
  { id: "metal", label: "Metaal" },
  { id: "matte_black", label: "Mat zwart" },
] as const;

function NfcDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const join = useServerFn(joinNfcWaitlist);
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]["id"] | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const r = await join({ data: { material } });
      if (r.ok) setDone(true);
      else toast.error("Opslaan mislukt, probeer later opnieuw");
    } catch {
      toast.error("Opslaan mislukt, probeer later opnieuw");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Nfc className="h-5 w-5" aria-hidden /> NFC Visitekaartje
          </DialogTitle>
          <DialogDescription>
            Binnenkort beschikbaar! Print je ROUT-profiel op een fysiek, contactloos NFC-visitekaartje (hout, metaal of
            mat zwart). Zet jezelf op de wachtlijst.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <p className="rounded-xl border border-border bg-muted/40 p-4 text-sm">Je staat op de wachtlijst. We laten het je weten zodra het kan.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Voorkeursmateriaal">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={material === m.id}
                  onClick={() => setMaterial(material === m.id ? null : m.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    material === m.id ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <Button type="button" className="w-full" disabled={busy} onClick={() => void submit()}>
              Zet mij op de wachtlijst
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
