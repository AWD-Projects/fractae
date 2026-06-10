import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FRACTAE",
    short_name: "FRACTAE",
    description: "Gestión integral de fraccionamientos y comunidades residenciales.",
    start_url: "/es",
    display: "standalone",
    background_color: "#FBFBFB",
    theme_color: "#062244",
    icons: [
      { src: "/favicon.png", sizes: "any", type: "image/png" },
    ],
  };
}
