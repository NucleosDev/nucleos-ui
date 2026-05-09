"use client";

import { NucleoDocument } from "./NucleoDocument";

interface DocumentPageWrapperProps {
  nucleoId: string;
  readOnly?: boolean;
  fullWidth?: boolean;
}

export function DocumentPageWrapper({
  nucleoId,
  readOnly = false,
  fullWidth = false,
}: DocumentPageWrapperProps) {
  return (
    <NucleoDocument
      nucleoId={nucleoId}
      readOnly={readOnly}
      fullWidth={fullWidth}
    />
  );
}
