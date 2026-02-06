/**
 * Standardized result for all action-based operations in combat
 * Ensures consistent error handling and response structure
 */
export default class ActionResult<TData = unknown> {
  ok: boolean;
  data: TData | null;
  reason: string | null;

  /**
   * @param ok Whether the action succeeded
   * @param data Success data (log text, events, etc)
   * @param reason Error reason code (SKILL_ON_COOLDOWN, NO_ACTIONS_LEFT, etc)
   */
  constructor(ok: boolean, data: TData | null = null, reason: string | null = null) {
    this.ok = ok;
    this.data = data;
    this.reason = reason;
  }

  /** dataEvent | dataText future feature
   * Create a successful result.
   * @param data optional payload for success (e.g. combat log text)
   * @param reason optional reason string (mostly unused for success)
   */
  static success<TData = unknown>(
    data: TData | null = null,
    reason: string | null = null,
  ): ActionResult<TData> {
    return new ActionResult<TData>(true, data, reason);
  }

  /**
   * Create a failed result
   */
  static failure(reason: string): ActionResult<null> {
    return new ActionResult<null>(false, null, reason);
  }

  /**
   * Check if action was successful
   */
  isSuccess(): boolean {
    return this.ok === true;
  }

  /**
   * Check if action failed
   */
  isFailure(): boolean {
    return this.ok === false;
  }
}

