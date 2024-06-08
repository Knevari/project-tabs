import React from "react";
import { Button } from "../button";
import * as styles from "./project-input.module.css";

export default function ProjectInput() {
  return (
    <form className={styles["project-input-wrapper"]}>
      <input
        type="text"
        name="project_name"
        placeholder="Project Name"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
      />
      <Button>CREATE</Button>
    </form>
  );
}
