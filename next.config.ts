import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf genera el PDF del repertorio en el servidor; debe cargarse tal cual, sin empaquetar.
  serverExternalPackages: ["@react-pdf/renderer"],
  // pdfkit carga sus fuentes internas con una ruta que Vercel no detecta; sin esto, el PDF falla en producción.
  outputFileTracingIncludes: {
    "/repertorio/descargar": ["./node_modules/pdfkit/js/standard-fonts/**", "./node_modules/pdfkit/js/data/**"],
  },
};

export default nextConfig;
