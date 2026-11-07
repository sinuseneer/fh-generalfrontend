import { base_uri } from "../config/api";

export function getImageUrl(imagePath) {
  if (typeof imagePath !== "string") return "";

  const path = imagePath.trim();
  if (!path) return "";

  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) {
    return path;
  }

  const relativePath = path.replace(/^\.\/+/, "");
  if (relativePath.startsWith("/") && !/^\/uploads(?:\/|$)/i.test(relativePath)) {
    return relativePath;
  }

  return `${base_uri}${relativePath.replace(/^\/+/, "")}`;
}
