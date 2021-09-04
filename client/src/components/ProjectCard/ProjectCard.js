import React from "react";
import styles from "./ProjectCard.module.css";
import { useHistory } from "react-router";

export default function ProjectCard({ project }) {
  const history = useHistory();
  return (
    <div className={styles.conteiner}>
      <div className={styles.header}>
        <h2>{project.projectName}</h2>
      </div>
      <div className={styles.body}>
        <div className={styles.description}>
          <div className={styles.title}>
            <h3>Description</h3>
            <div></div>
          </div>
          <p>{project.description}</p>
        </div>
        <div className={styles.status}>
          <div className={styles.title}>
            <h3>Progress</h3>
            <div></div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${project.status}%` }}
            ></div>
          </div>
          <h4>{project.status}%</h4>
          <div className={styles.projectItem}>
            <button
              onClick={() => {
                history.push("/project/" + project._id);
              }}
            >
              See details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
