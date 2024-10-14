export const isIOSDevice = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.platform);

export const hasVerticalScrollbar = (className: string): boolean => {
  const element: HTMLElement | null = document.querySelector(`.${className}`);
  if (!element) return false;
  return element.scrollHeight > element.clientHeight;
};
