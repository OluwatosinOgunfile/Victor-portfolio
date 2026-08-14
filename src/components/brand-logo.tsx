import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ href = "/", compact = false, className = "" }: { href?: string; compact?: boolean; className?: string }) {
  return <Link href={href} className={`brand-logo ${className}`} aria-label="Navill Tech home"><Image src="/navill-mark.svg" alt="" width={36} height={36} priority/><span>Navill <b>Tech</b>{!compact&&<small>BUSINESS SYSTEMS</small>}</span></Link>;
}
