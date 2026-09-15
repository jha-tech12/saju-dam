export const VIDEO_PATHS = {
  hero: {
    forward: "/videos/hero.mp4",
    reverse: "/videos/hero-reverse.mp4",
  },
  homeBottom: {
    forward: "/videos/home-bottom-bg.mp4",
    reverse: "/videos/home-bottom-bg-reverse.mp4",
  },
  mainBg: {
    forward: "/videos/main_bg.mp4",
    reverse: "/videos/main_bg-reverse.mp4",
  },
} as const;

export function getReverseVideoPath(forwardPath: string): string {
  return forwardPath.replace(/\.mp4$/i, "-reverse.mp4");
}
