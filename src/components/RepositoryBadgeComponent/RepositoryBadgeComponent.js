"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.js";
import styles from "./RepositoryBadgeComponent.module.css";

/**
 * RepositoryBadgeComponent — Semantic badge for a GitHub repository link.
 *
 * Strips the GitHub base URL and displays the owner/repo slug.
 * Renders as a clickable badge linking to the repository.
 *
 * @param {string} repo — Full GitHub URL (e.g. "https://github.com/user/repo")
 * @param {{ Github: React.ComponentType }} [icons] — Icon components
 * @param {string} [className] — Additional CSS class
 */
export default function RepositoryBadgeComponent({ repo, icons, className, ...rest }) {
  if (!repo) return null;

  const { Github } = icons || {};
  const slug = repo.replace("https://github.com/", "");

  return (
    <a
      href={repo}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <BadgeComponent
        variant="info"
        className={`${styles.badge} ${className || ""}`}
        tooltip={`GitHub: ${slug}`}
        {...rest}
      >
        {Github && <Github size={9} strokeWidth={2.2} />}
        {slug}
      </BadgeComponent>
    </a>
  );
}
