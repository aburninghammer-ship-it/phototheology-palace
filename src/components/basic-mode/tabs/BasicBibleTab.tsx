/**
 * BasicBibleTab — Redirects directly to the Study Bible
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BasicBibleTab() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/bible", { replace: true });
  }, [navigate]);

  return null;
}
