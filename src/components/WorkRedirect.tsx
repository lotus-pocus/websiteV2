// src/components/WorkRedirect.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WorkRedirect = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const slug = hash.replace("#", "").toLowerCase().replace(/\s+/g, "-");
      navigate(`/work/${slug}`, { replace: true });
    }
  }, [hash, navigate]);

  return null; // nothing visual
};

export default WorkRedirect;
