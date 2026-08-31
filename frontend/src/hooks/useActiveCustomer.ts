import { useState, useEffect } from "react";

export function useActiveCustomer() {
  const [activeId, setActiveId] = useState<string | null>(
    localStorage.getItem("activeCustomerId"),
  );

  useEffect(() => {
    if (activeId) localStorage.setItem("activeCustomerId", activeId);
    else localStorage.removeItem("activeCustomerId");
  }, [activeId]);

  return { activeId, setActiveId };
}
