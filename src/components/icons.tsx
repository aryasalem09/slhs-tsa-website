import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <circle cx="10.5" cy="10.2" r="6.2" />
      <path d="m15.3 15.4 4.9 4.7" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M3.5 6.5h17M3.8 12.2h16.4M3.5 17.8h17" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M5.5 5.8 18.4 18.4M18.2 5.5 5.7 18.3" />
    </svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M13.5 5H19v5.5M18.6 5.4 10 14M8 6H5v13h13v-3" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M4 12.2h15M13.5 6.2l6 6-6 6.1" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <rect x="3.2" y="5.4" width="17.6" height="13.4" rx="2.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M12 21.3s-6.8-6.4-6.8-11a6.8 6.8 0 0 1 13.6 0c0 4.6-6.8 11-6.8 11Z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.6" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconDiscord(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M19.6 5.6A17 17 0 0 0 15.6 4.3l-.5 1a15.7 15.7 0 0 0-6.2 0l-.5-1a17 17 0 0 0-4 1.3C1.9 9.2 1.2 12.7 1.5 16.2a17.2 17.2 0 0 0 5.2 2.6l1-1.6c-.9-.3-1.7-.7-2.4-1.2l.7-.5c3.3 1.6 7.1 1.6 10.4 0l.7.5c-.7.5-1.5.9-2.4 1.2l1 1.6a17.2 17.2 0 0 0 5.2-2.6c.4-4-.7-7.4-2.9-10.6ZM8.9 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}

export function IconRemind(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M4 4.8h16v11.4H10.2L5.4 20.4v-4.2H4z" />
      <path d="M9.2 8.4h5.6M9.2 11.4h4" />
    </svg>
  );
}
