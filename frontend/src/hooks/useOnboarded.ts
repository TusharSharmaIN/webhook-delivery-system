import { useState, useEffect } from "react";

export function useOnboarded() {
  const [onboarded, setOnboarded] = useState(
    localStorage.getItem("onboarded") === "true",
  );

  useEffect(() => {
    localStorage.setItem("onboarded", String(onboarded));
  }, [onboarded]);

  return { onboarded, setOnboarded };
}
