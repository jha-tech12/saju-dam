import Image from "next/image";

interface CounselorAvatarProps {
  src: string;
  alt: string;
  size?: "md" | "lg";
}

const sizeClasses = {
  md: "h-28 w-28",
  lg: "h-36 w-36",
} as const;

export function CounselorAvatar({
  src,
  alt,
  size = "md",
}: CounselorAvatarProps) {
  return (
    <div
      className={`mx-auto mb-5 ${sizeClasses[size]} rounded-full border-2 border-gold/25 bg-navy p-1 shadow-md shadow-black/20`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-gold/20 ring-inset">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top scale-105"
          sizes={size === "lg" ? "144px" : "112px"}
        />
      </div>
    </div>
  );
}
