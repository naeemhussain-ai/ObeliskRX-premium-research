import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Trash2,
  Edit2,
  Eye,
  Shield,
  LogOut,
  FileText,
  ImageIcon,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
  Package,
  Plus,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { getProducts, saveProduct, deleteProduct, type Product } from "@/lib/products";
import {
  getAdminCoaData,
  saveAdminCoa,
  deleteAdminCoa,
  coaData,
  getCoa,
  type AdminCoaEntry,
  type AdminCoaFile,
} from "@/lib/coa";
import { CoaDialog } from "@/components/CoaDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "obeliskadmin";
const SESSION_KEY = "obeliskrx-admin-session";
const MAX_TOTAL_MB = 4;

const SERIES_OPTIONS = [
  "Metabolic Series",
  "Recovery Series",
  "Growth Series",
  "Longevity Series",
  "Neuro Series",
  "Signature Blends",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function imageFileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Shield size={16} />
            Admin Access
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">ObeliskRX Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your admin password to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                className={`mt-1 ${error ? "border-red-500 focus:border-red-500" : ""}`}
                autoFocus
              />
              {error && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} />
                  Incorrect password. Please try again.
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Default password: <span className="font-mono">obeliskadmin</span>
          <br />
          Set <span className="font-mono">VITE_ADMIN_PASSWORD</span> to override
        </p>
      </div>
    </div>
  );
}

// ─── Staged File ─────────────────────────────────────────────────────────────

type StagedFile = {
  id: string;
  file: File;
  preview?: string;
};

// ─── Product Form Modal ───────────────────────────────────────────────────────

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  existing?: Product;
  onSaved: () => void;
};

function ProductFormModal({ open, onClose, existing, onSaved }: ProductFormModalProps) {
  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlugVal] = useState(existing?.slug ?? "");
  const [series, setSeries] = useState(existing?.series ?? SERIES_OPTIONS[0]);
  const [price, setPrice] = useState(existing?.price?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(existing?.priceMax?.toString() ?? "");
  const [oldPrice, setOldPrice] = useState(existing?.oldPrice?.toString() ?? "");
  const [discount, setDiscount] = useState(existing?.discount?.toString() ?? "0");
  const [sizes, setSizes] = useState(existing?.sizes?.join(", ") ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    existing?.specs ?? []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(existing?.image ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!existing);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManual && name) {
      setSlugVal(slugify(name));
    }
  }, [name, slugManual]);

  const handleNameChange = (v: string) => {
    setName(v);
  };

  const handleSlugChange = (v: string) => {
    setSlugManual(true);
    setSlugVal(v);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addSpec = () => setSpecs((prev) => [...prev, { label: "", value: "" }]);
  const removeSpec = (idx: number) => setSpecs((prev) => prev.filter((_, i) => i !== idx));
  const updateSpec = (idx: number, field: "label" | "value", val: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  const handleSave = async () => {
    if (!name.trim()) { setError("Product name is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }
    if (!price.trim() || isNaN(Number(price))) { setError("Valid price is required."); return; }
    if (!sizes.trim()) { setError("At least one size is required."); return; }

    setSaving(true);
    setError("");

    try {
      let imageUrl = existing?.image ?? "";
      if (imageFile) {
        imageUrl = await imageFileToDataUri(imageFile);
      }

      const product: Product = {
        slug: slug.trim(),
        name: name.trim(),
        series,
        image: imageUrl,
        price: Number(price),
        priceMax: priceMax.trim() ? Number(priceMax) : undefined,
        oldPrice: oldPrice.trim() ? Number(oldPrice) : undefined,
        discount: Number(discount) || 0,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        description: description.trim(),
        specs: specs.filter((s) => s.label.trim() || s.value.trim()),
      };

      saveProduct(product);
      onSaved();
      onClose();
    } catch {
      setError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border p-5">
          <DialogTitle>{existing ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {existing ? `Editing "${existing.name}"` : "Fill in the details for the new product."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Name & Slug */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pf-name">Name *</Label>
              <Input
                id="pf-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. BPC-157"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pf-slug">Slug *</Label>
              <Input
                id="pf-slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="e.g. bpc-157"
                className="mt-1 font-mono text-sm"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Auto-generated from name, or edit manually</p>
            </div>
          </div>

          {/* Series */}
          <div>
            <Label htmlFor="pf-series">Series</Label>
            <div className="relative mt-1">
              <select
                id="pf-series"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SERIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="pf-price">Price ($) *</Label>
              <Input
                id="pf-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 49.99"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pf-pricemax">Max Price (optional)</Label>
              <Input
                id="pf-pricemax"
                type="number"
                min="0"
                step="0.01"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="For multi-size"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pf-oldprice">Old Price (optional)</Label>
              <Input
                id="pf-oldprice"
                type="number"
                min="0"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Strikethrough price"
                className="mt-1"
              />
            </div>
          </div>

          {/* Discount & Sizes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pf-discount">Discount % (0–100)</Label>
              <Input
                id="pf-discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pf-sizes">Sizes * (comma-separated)</Label>
              <Input
                id="pf-sizes"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="e.g. 10mg, 20mg"
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="pf-desc">Description</Label>
            <textarea
              id="pf-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Product description..."
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Specs */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Specs</Label>
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <Plus size={13} />
                Add Spec
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-muted-foreground shrink-0" />
                  <Input
                    value={spec.label}
                    onChange={(e) => updateSpec(idx, "label", e.target.value)}
                    placeholder="Label (e.g. CAS Number)"
                    className="flex-1 text-xs"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpec(idx, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No specs yet. Click "Add Spec" to add one.</p>
              )}
            </div>
          </div>

          {/* Image */}
          <div>
            <Label>Product Image</Label>
            <div className="mt-2 flex items-start gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              {!imagePreview && (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
                  <ImageIcon size={24} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-surface transition-colors"
                >
                  <Upload size={14} />
                  {imagePreview ? "Replace Image" : "Upload Image"}
                </button>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Accepts JPG, PNG, WebP. Will be stored as base64.
                </p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle size={14} />
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : existing ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Product Delete Confirm ───────────────────────────────────────────────────

function ProductDeleteConfirm({
  open,
  productName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 size={18} />
            Delete Product
          </DialogTitle>
          <DialogDescription className="pt-2">
            Permanently delete{" "}
            <span className="font-semibold text-foreground">{productName}</span>? This cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState(() => getProducts());
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const refresh = () => setProducts(getProducts());

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Products</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage the product catalog. Changes are stored in browser storage.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="flex items-center gap-2">
          <Plus size={15} />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Products
          </p>
          <p className="mt-1 text-3xl font-bold text-primary">{products.length}</p>
          <p className="text-xs text-muted-foreground">in catalog</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Series
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {new Set(products.map((p) => p.series)).size}
          </p>
          <p className="text-xs text-muted-foreground">unique series</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Avg Price
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            ${products.length ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(0) : "0"}
          </p>
          <p className="text-xs text-muted-foreground">across all products</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Series</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Sizes</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.slug}
                className="border-b border-border last:border-0 hover:bg-surface/60"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
                        <ImageIcon size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold leading-tight">{p.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{p.series}</td>
                <td className="px-5 py-3 text-sm">
                  <span className="font-semibold">${p.price.toFixed(2)}</span>
                  {p.priceMax && (
                    <span className="text-muted-foreground"> – ${p.priceMax.toFixed(2)}</span>
                  )}
                  {p.oldPrice && (
                    <span className="ml-1 text-[11px] line-through text-muted-foreground">
                      ${p.oldPrice.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.sizes.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View on site */}
                    <a
                      href={`/product/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on site"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                    >
                      <Eye size={15} />
                    </a>
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditTarget(p)}
                      title="Edit product"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      title="Delete product"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No products found.{" "}
                  <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="text-primary underline"
                  >
                    Add the first product
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        <Package size={12} className="inline mr-1" />
        Products are stored in browser localStorage and persist until cleared.
      </p>

      {/* Add Modal */}
      {addOpen && (
        <ProductFormModal
          open={true}
          onClose={() => setAddOpen(false)}
          onSaved={refresh}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <ProductFormModal
          open={true}
          onClose={() => setEditTarget(null)}
          existing={editTarget}
          onSaved={refresh}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ProductDeleteConfirm
          open={true}
          productName={deleteTarget.name}
          onConfirm={() => {
            deleteProduct(deleteTarget.slug);
            refresh();
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ─── COA Tab ──────────────────────────────────────────────────────────────────

type CoaSource = "custom" | "static" | "none";

function getCoaSource(slug: string, adminData: Record<string, AdminCoaEntry>): CoaSource {
  if (adminData[slug]) return "custom";
  if (coaData[slug]) return "static";
  return "none";
}

function SourceBadge({ source }: { source: CoaSource }) {
  if (source === "custom")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
        <CheckCircle2 size={11} />
        Custom
      </span>
    );
  if (source === "static")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
        <Shield size={11} />
        Built-in
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-500">
      <XCircle size={11} />
      None
    </span>
  );
}

// ─── Upload / Edit Modal ─────────────────────────────────────────────────────

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
  slug: string;
  productName: string;
  existing?: AdminCoaEntry;
  onSaved: () => void;
};

function UploadModal({ open, onClose, slug, productName, existing, onSaved }: UploadModalProps) {
  const [purity, setPurity] = useState(existing?.purity ?? "");
  const [lot, setLot] = useState(existing?.lot ?? "");
  const [tested, setTested] = useState(existing?.tested ?? "");
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [keepExisting, setKeepExisting] = useState<AdminCoaFile[]>(existing?.files ?? []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalStagedBytes = staged.reduce((s, f) => s + f.file.size, 0);
  const totalKeepBytes = keepExisting.reduce((s, f) => s + Math.round((f.data.length * 3) / 4), 0);
  const totalMB = (totalStagedBytes + totalKeepBytes) / (1024 * 1024);
  const sizeWarning = totalMB > MAX_TOTAL_MB;

  const handleFiles = useCallback((files: File[]) => {
    const accepted = files.filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    const newStaged: StagedFile[] = accepted.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    setStaged((prev) => [...prev, ...newStaged]);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleSave = async () => {
    if (!purity.trim() || !lot.trim() || !tested.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (staged.length === 0 && keepExisting.length === 0) {
      setError("Please upload at least one file.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const newFiles: AdminCoaFile[] = await Promise.all(
        staged.map(async (sf) => ({
          name: sf.file.name,
          type: sf.file.type,
          data: await fileToBase64(sf.file),
        })),
      );
      const entry: AdminCoaEntry = {
        slug,
        purity: purity.trim(),
        lot: lot.trim(),
        tested: tested.trim(),
        files: [...keepExisting, ...newFiles],
      };
      saveAdminCoa(entry);
      staged.forEach((sf) => sf.preview && URL.revokeObjectURL(sf.preview));
      onSaved();
      onClose();
    } catch {
      setError("Failed to process files. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const removeStaged = (id: string) => {
    setStaged((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const removeExisting = (idx: number) => {
    setKeepExisting((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border p-5">
          <DialogTitle>{existing ? "Edit COA" : "Upload COA"}   {productName}</DialogTitle>
          <DialogDescription>
            Upload image(s) or PDF. These will override any built-in COA for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Fields */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="purity">Purity %</Label>
              <Input
                id="purity"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder="e.g. 99.5%"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lot">Lot Number</Label>
              <Input
                id="lot"
                value={lot}
                onChange={(e) => setLot(e.target.value)}
                placeholder="e.g. RT20"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tested">Test Date</Label>
              <Input
                id="tested"
                value={tested}
                onChange={(e) => setTested(e.target.value)}
                placeholder="e.g. Jul 30, 2026"
                className="mt-1"
              />
            </div>
          </div>

          {/* Drop zone */}
          <div>
            <Label>Files (Images or PDF)</Label>
            <div
              className={`mt-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-surface hover:border-primary/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP, PDF
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
            />
          </div>

          {/* Existing files (edit mode) */}
          {keepExisting.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Files
              </p>
              {keepExisting.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  {f.type.includes("pdf") ? (
                    <FileText size={18} className="shrink-0 text-red-500" />
                  ) : (
                    <ImageIcon size={18} className="shrink-0 text-blue-500" />
                  )}
                  <span className="flex-1 truncate text-sm">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeExisting(idx)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Staged files */}
          {staged.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                New Files to Upload
              </p>
              {staged.map((sf) => (
                <div
                  key={sf.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  {sf.preview ? (
                    <img
                      src={sf.preview}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <FileText size={18} className="shrink-0 text-red-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{sf.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(sf.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaged(sf.id)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Size warning */}
          {sizeWarning && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>
                Total file size is {totalMB.toFixed(2)} MB. Large files may exceed browser storage
                limits. Consider compressing files before uploading.
              </p>
            </div>
          )}

          {error && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle size={14} />
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : existing ? "Save Changes" : "Upload COA"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm (COA) ─────────────────────────────────────────────────────

function DeleteConfirm({
  open,
  productName,
  hasStatic,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  productName: string;
  hasStatic: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 size={18} />
            Delete Custom COA
          </DialogTitle>
          <DialogDescription className="pt-2">
            Remove the custom COA for <span className="font-semibold text-foreground">{productName}</span>?
            {hasStatic && (
              <span className="mt-2 block rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
                This product has a built-in COA that will be shown after deletion.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── COA Tab ──────────────────────────────────────────────────────────────────

function CoaTab() {
  const products = getProducts();
  const [adminData, setAdminData] = useState(() => getAdminCoaData());
  const [uploadTarget, setUploadTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [viewTarget, setViewTarget] = useState<{ slug: string; name: string } | null>(null);

  const refresh = () => setAdminData(getAdminCoaData());

  const withCustom = products.filter((p) => adminData[p.slug]).length;
  const withBuiltin = products.filter((p) => !adminData[p.slug] && coaData[p.slug]).length;
  const withNone = products.filter((p) => !getCoa(p.slug)).length;

  const viewCoa = viewTarget ? getCoa(viewTarget.slug) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">COA Management</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Upload, edit, or remove Certificate of Analysis files for each product.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Custom COAs", value: withCustom, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Built-in COAs", value: withBuiltin, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "No COA", value: withNone, color: "text-gray-500", bg: "bg-gray-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">of {products.length} products</p>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Series</th>
              <th className="px-5 py-4">COA Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const source = getCoaSource(p.slug, adminData);
              return (
                <tr
                  key={p.slug}
                  className="border-b border-border last:border-0 hover:bg-surface/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
                          <ImageIcon size={16} className="text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold leading-tight">{p.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{p.series}</td>
                  <td className="px-5 py-3">
                    <SourceBadge source={source} />
                    {source === "custom" && adminData[p.slug] && (
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {adminData[p.slug].files.length} file(s) · {adminData[p.slug].purity}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View */}
                      {source !== "none" && (
                        <button
                          type="button"
                          onClick={() => setViewTarget({ slug: p.slug, name: p.name })}
                          title="View COA"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {/* Upload / Edit */}
                      <button
                        type="button"
                        onClick={() => setUploadTarget({ slug: p.slug, name: p.name })}
                        title={source === "custom" ? "Edit COA" : "Upload COA"}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {source === "custom" ? <Edit2 size={15} /> : <Upload size={15} />}
                      </button>
                      {/* Delete (only custom) */}
                      {source === "custom" && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ slug: p.slug, name: p.name })}
                          title="Delete custom COA"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        <Package size={12} className="inline mr-1" />
        Custom COAs are stored in browser storage and take priority over built-in COAs.
        They persist until deleted or browser data is cleared.
      </p>

      {/* Upload / Edit Modal */}
      {uploadTarget && (
        <UploadModal
          open={true}
          onClose={() => setUploadTarget(null)}
          slug={uploadTarget.slug}
          productName={uploadTarget.name}
          existing={adminData[uploadTarget.slug]}
          onSaved={refresh}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm
          open={true}
          productName={deleteTarget.name}
          hasStatic={!!coaData[deleteTarget.slug]}
          onConfirm={() => {
            deleteAdminCoa(deleteTarget.slug);
            refresh();
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* View COA Dialog */}
      {viewTarget && viewCoa && (
        <CoaDialog
          open={true}
          onOpenChange={(v) => !v && setViewTarget(null)}
          images={viewCoa.images}
          fileTypes={viewCoa.fileTypes}
          title={viewTarget.name}
        />
      )}
    </div>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────

type AdminTab = "products" | "coa";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>("products");

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="container-page flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <Shield size={13} />
              Admin Panel
            </div>
            <span className="hidden text-lg font-bold sm:block">ObeliskRX</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <div className="container-page py-8 space-y-8">
        {/* Tab switcher */}
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1 w-fit shadow-sm">
          <button
            type="button"
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "products"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <Package size={15} />
            Products
          </button>
          <button
            type="button"
            onClick={() => setTab("coa")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "coa"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <FileText size={15} />
            COA
          </button>
        </div>

        {/* Tab content */}
        {tab === "products" ? <ProductsTab /> : <CoaTab />}
      </div>
    </div>
  );
}

// ─── Exported Page ────────────────────────────────────────────────────────────

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
