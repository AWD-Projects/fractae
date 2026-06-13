import QRCodeLib from "qrcode";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const GRAPH_POINTS = [0, 20, 10, 35, 25, 55, 40, 70, 60, 85, 72, 90, 80, 100, 88];

function buildAreaPath(points: number[], w: number, h: number): string {
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - (v / 100) * h * 0.6 - h * 0.08);

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const cpx = (xs[i] + xs[i + 1]) / 2;
    d += ` C ${cpx} ${ys[i]}, ${cpx} ${ys[i + 1]}, ${xs[i + 1]} ${ys[i + 1]}`;
  }
  d += ` L ${xs[xs.length - 1]} ${h} L ${xs[0]} ${h} Z`;
  return d;
}

function buildLinePath(points: number[], w: number, h: number): string {
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - (v / 100) * h * 0.6 - h * 0.08);

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const cpx = (xs[i] + xs[i + 1]) / 2;
    d += ` C ${cpx} ${ys[i]}, ${cpx} ${ys[i + 1]}, ${xs[i + 1]} ${ys[i + 1]}`;
  }
  return d;
}

function QRCode({ size = 82 }: { size?: number }) {
  const qr = QRCodeLib.create("https://fractae.mx", { errorCorrectionLevel: "M" });
  const count = qr.modules.size;
  const cell = size / count;
  const r = cell * 0.25;

  const rects: React.ReactNode[] = [];
  qr.modules.data.forEach((val, i) => {
    if (!val) return;
    const row = Math.floor(i / count);
    const col = i % count;
    rects.push(
      <rect
        key={i}
        x={col * cell + cell * 0.08}
        y={row * cell + cell * 0.08}
        width={cell * 0.84}
        height={cell * 0.84}
        rx={r}
        ry={r}
        fill="#FBFBFB"
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rects}
    </svg>
  );
}

export function ActiveUsersCard({
  label,
  badge,
  className,
}: {
  label: string;
  badge: string;
  className?: string;
}) {
  const W = 280;
  const H = 110;
  const area = buildAreaPath(GRAPH_POINTS, W, H);
  const line = buildLinePath(GRAPH_POINTS, W, H);

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-chip overflow-hidden bg-[#E8E8E8]",
        className
      )}
    >
      <div className="px-4 lg:px-6 pt-4 lg:pt-5 flex flex-col gap-1">
        <span className="text-[11px] lg:text-[13px] font-normal text-navy/60 leading-none">{label}</span>
        <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
          <span className="text-[22px] lg:text-[32px] font-bold text-navy leading-none">2840</span>
          <span className="text-[10px] lg:text-[12px] font-medium text-navy/60">{badge}</span>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27B8FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#27B8FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={line} fill="none" stroke="#27B8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function AccessCard({
  visitor,
  unit,
  time,
  className,
}: {
  visitor: string;
  unit: string;
  time: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-chip bg-navy px-5 py-4",
        className
      )}
    >
      {/* Name + unit on top */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#FBFBFB] leading-none">{visitor}</span>
        <span className="text-[11px] text-[#FBFBFB]/60 leading-none">{unit}</span>
      </div>

      {/* QR code centered */}
      <div className="flex justify-center items-center flex-1 py-1">
        <div className="block lg:hidden"><QRCode size={58} /></div>
        <div className="hidden lg:block"><QRCode size={82} /></div>
      </div>

      {/* Date centered at bottom */}
      <div className="flex justify-center">
        <span className="text-[11px] text-[#FBFBFB]/50 leading-none">{time}</span>
      </div>
    </div>
  );
}

/**
 * Blue metric card — Figma: Card-2, fill #27B8FF, cornerRadius 48,
 * padding [10,28], gap 13, width 198, height fill_container.
 */
export function MetricCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-2 lg:gap-3 rounded-chip bg-secondary",
        "px-4 lg:px-7 py-2.5",
        className
      )}
    >
      <div className="w-7 h-7 lg:w-[39px] lg:h-[39px] flex items-center justify-center">
        <TrendingUp
          size={20}
          strokeWidth={2}
          className="text-background lg:hidden"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <TrendingUp
          size={32.5}
          strokeWidth={2}
          className="text-background hidden lg:block"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </div>
      <p
        className="text-[20px] lg:text-[28px] font-semibold text-background leading-tight tracking-[0.1px]"
        style={{ textAlignVertical: "middle" } as React.CSSProperties}
      >
        {value}
      </p>
      <p className="text-[14px] lg:text-[22px] text-background font-normal leading-snug tracking-[0.1px]">
        {label}
      </p>
    </div>
  );
}

/**
 * White payment card — Figma: Card-3.
 */
export function PaymentCard({
  amount,
  status,
  ownerName = "Juan Manuel",
  unit = "Casa 14",
  className,
}: {
  amount: string;
  status: string;
  ownerName?: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-[19px] rounded-chip bg-white",
        "px-6 py-2.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-1 w-full px-1">
        <span className="text-[9px] lg:text-[10px] font-medium text-navy/50 leading-[2] tracking-[0.1px] truncate">
          {ownerName}
        </span>
        <span className="text-[9px] lg:text-[10px] font-normal text-navy/50 leading-[2] tracking-[0.1px] text-right truncate">
          {unit}
        </span>
      </div>
      <p className="text-[22px] lg:text-[32px] font-bold text-navy text-center leading-tight tracking-[0.1px] w-full">
        {amount}
      </p>
      <p className="text-[11px] lg:text-[12px] font-semibold text-warning text-center leading-[1.667] tracking-[0.1px]">
        {status}
      </p>
    </div>
  );
}
