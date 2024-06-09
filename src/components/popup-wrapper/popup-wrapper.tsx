import React from "react";

export default function PopupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[400px] p-3 flex flex-col gap-3">{children}</div>
  );
}
