// CSS pixel comparison presets, not hardware / user-agent emulation.
export const devices = Object.freeze({
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
});

export function previewGeometry(device, view, availableWidth, contentHeight = 900) {
  const available = Math.max(1, Math.floor(availableWidth));
  const preset = devices[device];
  const width = preset?.width ?? Math.max(320, available);
  const height = preset?.height ?? Math.max(1, Math.ceil(contentHeight));
  const scale = view === 'fit' ? Math.min(1, available / width) : 1;
  return { width, height, scale, displayWidth: width * scale, displayHeight: height * scale };
}
