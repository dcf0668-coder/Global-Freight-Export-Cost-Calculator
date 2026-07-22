import { ShippingLine } from "@/types";

export const shippingLines: ShippingLine[] = [
  { id: "cosco", name: "COSCO Shipping", slug: "cosco", website: "https://lines.coscoshipping.com", trackingUrl: "https://elines.coscoshipping.com/ebusiness/cargoTracking", coverageRegions: ["Global"], offersContainer: true, offersRoro: false, description: "One of the world's largest container carriers, with extensive China-origin coverage." },
  { id: "msc", name: "MSC", slug: "msc", website: "https://www.msc.com", trackingUrl: "https://www.msc.com/en/track-a-shipment", coverageRegions: ["Global"], offersContainer: true, offersRoro: false, description: "The largest container shipping line by capacity, serving over 200 trade routes." },
  { id: "maersk", name: "Maersk", slug: "maersk", website: "https://www.maersk.com", trackingUrl: "https://www.maersk.com/tracking", coverageRegions: ["Global"], offersContainer: true, offersRoro: true, description: "Global integrated logistics leader offering container and RoRo vehicle transport." },
  { id: "one", name: "Ocean Network Express (ONE)", slug: "one", website: "https://www.one-line.com", trackingUrl: "https://ecomm.one-line.com/one-ecom/tracking", coverageRegions: ["Asia", "Americas", "Europe"], offersContainer: true, offersRoro: false, description: "Japanese-Singaporean carrier formed from NYK, MOL, and K-Line container operations." },
  { id: "cma-cgm", name: "CMA CGM", slug: "cma-cgm", website: "https://www.cma-cgm.com", trackingUrl: "https://www.cma-cgm.com/ebusiness/tracking", coverageRegions: ["Global"], offersContainer: true, offersRoro: false, description: "French carrier with deep Africa and Middle East trade lane coverage." },
  { id: "evergreen", name: "Evergreen Line", slug: "evergreen", website: "https://www.evergreen-line.com", trackingUrl: "https://ct.shipmentlink.com/servlet/TDB1_CargoTracking", coverageRegions: ["Asia", "Americas", "Europe"], offersContainer: true, offersRoro: false, description: "Taiwanese carrier with strong Trans-Pacific and Intra-Asia services." },
  { id: "hapag-lloyd", name: "Hapag-Lloyd", slug: "hapag-lloyd", website: "https://www.hapag-lloyd.com", trackingUrl: "https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-solution.html", coverageRegions: ["Global"], offersContainer: true, offersRoro: false, description: "German carrier known for reliability on Europe and Latin America lanes." },
  { id: "zim", name: "ZIM", slug: "zim", website: "https://www.zim.com", trackingUrl: "https://www.zim.com/tools/track-a-shipment", coverageRegions: ["Asia", "Americas", "Mediterranean"], offersContainer: true, offersRoro: false, description: "Israeli carrier specializing in niche and fast Trans-Pacific services." },
  { id: "pil", name: "Pacific International Lines (PIL)", slug: "pil", website: "https://www.pilship.com", trackingUrl: "https://www.pilship.com/en/eservice/cargo-tracking.html", coverageRegions: ["Asia", "Africa", "Middle East"], offersContainer: true, offersRoro: true, description: "Singaporean carrier with strong Africa and RoRo vehicle export capability." },
];

export function getShippingLineBySlug(slug: string): ShippingLine | undefined {
  return shippingLines.find((s) => s.slug === slug);
}
