export function usePathname(): string {
  return "/dashboard";
}

export function useRouter(): { push: (href: string) => void } {
  return {
    push: (href: string) => {
      console.info("storybook router push", href);
    },
  };
}
