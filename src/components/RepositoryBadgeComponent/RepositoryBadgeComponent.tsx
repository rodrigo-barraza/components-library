// @ts-nocheck
"use client";

import BadgeComponent from "../BadgeComponent/BadgeComponent.tsx";
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

  // Normalize SSH (git@github.com:owner/repo.git) and HTTPS URLs to owner/repo slug
  let slug = repo;
  let href = repo;

  const sshMatch = repo.match(/^git@github\.com:(.+?)(?:\.git)?$/);
  if (sshMatch) {
    slug = sshMatch[1];
    href = `https://github.com/${slug}`;
  } else {
    slug = repo.replace("https://github.com/", "");
  }

  return (
    <a
      href={href}
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
