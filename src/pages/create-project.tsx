import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/button";
import { CreateProject } from "@/components/create-project";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Create Project</h1>
        <Button onClick={() => navigate("/")}>See my projects</Button>
      </div>
      <CreateProject />
    </>
  );
}
