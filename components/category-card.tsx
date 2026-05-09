import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  accentColor: string;
  accentBg: string;
  badge?: string;
}

export function CategoryCard({
  title,
  description,
  icon: Icon,
  href,
  accentColor,
  accentBg,
  badge,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-lg p-6 border border-[#dbe3f0] hover:border-[#bdc9dc] hover:shadow-md transition-all duration-200 flex flex-col gap-4 cursor-pointer"
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full bg-[#fff7e4] text-[#9b6500]">
          {badge}
        </span>
      )}

      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: accentBg }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      <div
        className="flex items-center gap-1.5 text-sm font-medium"
        style={{ color: accentColor }}
      >
        Get help
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
      </div>
    </Link>
  );
}
