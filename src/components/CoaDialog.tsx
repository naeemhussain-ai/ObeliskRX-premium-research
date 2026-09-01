import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CoaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  fileTypes?: string[];
  title: string;
};

function CoaFile({ src, type, alt }: { src: string; type?: string; alt: string }) {
  const isPdf = type ? type.includes("pdf") : src.startsWith("data:application/pdf");
  if (isPdf) {
    return (
      <iframe
        src={src}
        title={alt}
        className="w-full rounded-lg border border-border shadow-card"
        style={{ height: "800px" }}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-lg border border-border shadow-card"
    />
  );
}

export function CoaDialog({ open, onOpenChange, images, fileTypes, title }: CoaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border p-4 text-left sm:p-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Certificate of Analysis</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto bg-surface p-4 sm:p-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {images.map((src, i) => (
              <CoaFile
                key={i}
                src={src}
                type={fileTypes?.[i]}
                alt={`${title} Certificate of Analysis — page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
