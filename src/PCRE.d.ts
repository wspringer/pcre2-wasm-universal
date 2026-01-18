/**
 * Represents a single match group from a PCRE2 match operation.
 */
export interface MatchGroup {
  /** Start index of the match in the subject string */
  start: number;
  /** End index of the match in the subject string (exclusive) */
  end: number;
  /** The matched substring */
  match: string;
  /** Name of the capture group, if it was a named group */
  name?: string;
  /** Numeric index of the group (present when accessed by name) */
  group?: number;
}

/**
 * Result of a PCRE2 match operation.
 * Can be indexed by number (capture group index) or by name (named capture group).
 */
export interface MatchResult {
  /** Access capture group by index (0 = full match, 1+ = capture groups) */
  [index: number]: MatchGroup;
  /** Access named capture group by name, or length property */
  [name: string]: MatchGroup | number;
  /** Number of capture groups (including the full match at index 0) */
  length: number;
}

/**
 * PCRE2 (Perl Compatible Regular Expressions 2) wrapper for WebAssembly.
 *
 * @example
 * ```typescript
 * import PCRE from 'pcre2-wasm-universal';
 *
 * await PCRE.init();
 *
 * const regex = new PCRE('(?<word>\\w+)', 'g');
 * const result = regex.match('hello world');
 * console.log(result?.word.match); // 'hello'
 *
 * regex.destroy(); // Important: free WASM memory
 * ```
 */
export default class PCRE {
  /**
   * Initialize the PCRE2 WebAssembly module.
   * Must be called before creating any PCRE instances.
   */
  static init(): Promise<void>;

  /**
   * Get the PCRE2 library version string.
   * @returns Version string (e.g., "10.42 2022-12-11")
   */
  static version(): string;

  /**
   * Create a new PCRE2 compiled pattern.
   * @param pattern - The regular expression pattern
   * @param flags - Optional flags string (e.g., 'i' for case-insensitive, 'g' for global)
   * @throws Error if pattern compilation fails (with offset property indicating error location)
   */
  constructor(pattern: string, flags?: string);

  /**
   * Free the WASM memory associated with this pattern.
   * Should be called when the pattern is no longer needed to prevent memory leaks.
   */
  destroy(): void;

  /**
   * Match the pattern against a subject string.
   * @param subject - The string to match against
   * @param start - Optional starting offset in the subject string
   * @returns Match result object, or null if no match found
   * @throws Error if a PCRE2 error occurs (other than no match)
   */
  match(subject: string, start?: number): MatchResult | null;

  /**
   * Find all matches of the pattern in the subject string.
   * @param subject - The string to match against
   * @returns Array of match results (empty array if no matches)
   */
  matchAll(subject: string): MatchResult[];

  /**
   * Replace the first match with a replacement string.
   * @param subject - The string to perform substitution on
   * @param replacement - The replacement string (supports PCRE2 substitution syntax)
   * @param startOffset - Optional starting offset in the subject string
   * @param options - Optional PCRE2 substitution options flags
   * @returns The resulting string after substitution, or null if startOffset >= subject.length
   * @throws Error if a PCRE2 error occurs
   */
  substitute(subject: string, replacement: string, startOffset?: number, options?: number): string | null;

  /**
   * Replace all matches with a replacement string.
   * @param subject - The string to perform substitution on
   * @param replacement - The replacement string (supports PCRE2 substitution syntax)
   * @returns The resulting string after all substitutions, or null if subject is empty
   */
  substituteAll(subject: string, replacement: string): string | null;
}
