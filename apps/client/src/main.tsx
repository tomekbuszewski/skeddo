import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@skeddo/ui/src/style.css";
import { Button } from "@skeddo/ui/atoms/button";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Button>btn</Button>
    <div className="bg-red-100 text-2xl">hello</div>
  </StrictMode>,
);
