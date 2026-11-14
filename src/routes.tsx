import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/about/AboutUs";
import Infrastructure from "./pages/about/Infrastructure";
import Values from "./pages/about/Values";
import Process from "./pages/about/Process";
import Founder from "./pages/about/Founder";
import Vision from "./pages/about/Vision";
import Products from "./pages/products/Products";
import ProductTemplate from "./components/ProductTemplate";
import Industries from "./pages/industries/Industries";
import IndustryTemplate from "./components/IndustryTemplate";
import IAmRecyclable from "./pages/IAmRecyclable";
import PackagingSecurity from "./pages/PackagingSecurity";
import Certifications from "./pages/Certifications";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import { PATHS } from "./i18n/navigation";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: PATHS.home, element: <Home /> },
      { path: PATHS.about, element: <AboutUs /> },
      { path: PATHS.aboutInfrastructure, element: <Infrastructure /> },
      { path: PATHS.aboutValues, element: <Values /> },
      { path: PATHS.aboutProcess, element: <Process /> },
      { path: PATHS.aboutFounder, element: <Founder /> },
      { path: PATHS.aboutVision, element: <Vision /> },
      { path: PATHS.products, element: <Products /> },
      // Retired routes. Static paths outrank the /products/:slug pattern below,
      // so these redirect rather than falling through to a 404.
      //
      // 1. The three category landing pages — /products now lists everything.
      ...[
        "/products/woven-bags",
        "/products/flexible-packaging",
        "/products/add-ons",
      ].map((path) => ({ path, element: <Navigate to={PATHS.products} replace /> })),
      // 2. Discontinued products whose detail pages were removed from the catalog.
      { path: "/products/bopp-tube-bags", element: <Navigate to={PATHS.products} replace /> },
      // 3. The security category and its five detail pages — now /packaging-security.
      ...[
        "/products/security-features",
        "/products/holographic-film",
        "/products/qr-codes",
        "/products/barcodes",
        "/products/product-authentication",
        "/products/brand-protection",
      ].map((path) => ({
        path,
        element: <Navigate to={PATHS.packagingSecurity} replace />,
      })),
      { path: "/products/:slug", element: <ProductTemplate /> },
      { path: PATHS.industries, element: <Industries /> },
      { path: "/industry-solutions/:slug", element: <IndustryTemplate /> },
      { path: PATHS.packagingSecurity, element: <PackagingSecurity /> },
      { path: PATHS.recyclable, element: <IAmRecyclable /> },
      // Retired routes — the eco story now lives on one page. Keep these so
      // existing links, bookmarks and indexed URLs land somewhere real.
      { path: "/sustainability", element: <Navigate to={PATHS.recyclable} replace /> },
      { path: "/recyclable", element: <Navigate to={PATHS.recyclable} replace /> },
      { path: PATHS.certifications, element: <Certifications /> },
      { path: PATHS.careers, element: <Careers /> },
      { path: PATHS.contact, element: <Contact /> },
      { path: PATHS.faqs, element: <Faqs /> },
      { path: PATHS.privacy, element: <LegalPage kind="privacy" path={PATHS.privacy} /> },
      { path: PATHS.terms, element: <LegalPage kind="terms" path={PATHS.terms} /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
