/**
 * @aigenticdocs/core — shared domain model for the AIGenticDocs tooling.
 *
 * The values here mirror the standard (docs/standard/): if the standard
 * changes its allowed values, this module is the single place to update.
 */

/** Severity scale of a lint finding, as defined in AGENT_REVIEW.md. */
export type Severity = "critical" | "warning" | "suggestion";

/** One result of a mechanical validation against an adopting project. */
export interface Finding {
  /** Lint rule ID, e.g. "frontmatter/required-fields". */
  rule: string;
  severity: Severity;
  /** Path of the offending file, relative to the repository root. */
  file: string;
  message: string;
}

/** Adoption depth declared by an adopting project. */
export type AdoptionProfile = "lite" | "full";

/** Allowed values of the `state` frontmatter field (working documents). */
export const STATES = ["pending", "doing", "done", "deprecated"] as const;
export type State = (typeof STATES)[number];

/** Allowed values of the `status` frontmatter field of ADRs. */
export const ADR_STATUSES = ["proposed", "accepted", "rejected", "superseded"] as const;
export type AdrStatus = (typeof ADR_STATUSES)[number];

/** Allowed values of the `status` frontmatter field of Correction Records. */
export const CORRECTION_STATUSES = ["proposed", "approved", "applied", "rejected"] as const;
export type CorrectionStatus = (typeof CORRECTION_STATUSES)[number];

/** Frontmatter fields required on every content document of the standard. */
export const REQUIRED_COMMON_FIELDS = ["type", "version", "last_updated"] as const;
