const icons: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16.5 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78V9.5a6.1 6.1 0 1 0 5.26 6.05V8.83a7.9 7.9 0 0 0 4.5 1.4V6.98a4.7 4.7 0 0 1-4.5-4.98Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M21.6 7.2s-.2-1.53-.83-2.2c-.8-.86-1.68-.87-2.09-.92C15.8 3.9 12 3.9 12 3.9h-.01s-3.8 0-6.68.18c-.41.05-1.3.06-2.09.92-.63.67-.83 2.2-.83 2.2S2.2 9 2.2 10.78v1.44C2.2 14 2.4 15.8 2.4 15.8s.2 1.53.83 2.2c.8.86 1.83.83 2.29.92 1.66.16 6.48.2 6.48.2s3.8-.01 6.68-.18c.41-.05 1.3-.06 2.09-.92.63-.67.83-2.2.83-2.2s.2-1.8.2-3.58v-1.44c0-1.78-.2-3.58-.2-3.58ZM9.95 14.6V8.9l5.4 2.86-5.4 2.85Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.77.47 3.45 1.29 4.9L2 22l5.25-1.37A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm5.5 14.14c-.24.67-1.37 1.31-1.89 1.36-.5.06-1.03.27-3.46-.72-2.92-1.2-4.79-4.14-4.94-4.34-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.42.27-.29.58-.36.78-.36h.55c.18 0 .42-.03.65.5.24.55.83 1.9.9 2.04.07.14.12.3.02.49-.1.19-.15.31-.3.48-.14.16-.3.36-.43.48-.14.14-.3.29-.13.57.17.29.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.37 1.47.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.63.77 1.91.91.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
    </svg>
  ),
};

export default function SocialIcons({
  facebook,
  tiktok,
  youtube,
  whatsapp,
  className = "",
  linkClassName = "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-cyan hover:text-cyan",
}: {
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  className?: string;
  linkClassName?: string;
}) {
  const links = [
    { key: "facebook", url: facebook, label: "Facebook" },
    { key: "tiktok", url: tiktok, label: "TikTok" },
    { key: "youtube", url: youtube, label: "YouTube" },
    { key: "whatsapp", url: whatsapp, label: "WhatsApp" },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={linkClassName}
        >
          {icons[link.key]}
        </a>
      ))}
    </div>
  );
}
