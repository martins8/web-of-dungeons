/**
 * Standardized result for all action-based operations in combat
 * Ensures consistent error handling and response structure
 */
export default class ActionResult {
  /**
   * @param {boolean} ok - Whether the action succeeded
   * @param {object} data - Success data (log text, events, etc)
   * @param {string} reason - Error reason code (SKILL_ON_COOLDOWN, NO_ACTIONS_LEFT, etc)
   */
  constructor(ok, data = null, reason = null) {
    this.ok = ok;
    this.data = data;
    this.reason = reason;
  }

  /**
   * Create a successful result
   */
  static success(data = null, reason = null) {
    return new ActionResult(true, data, reason);
  }

  /**
   * Create a failed result
   */
  static failure(reason) {
    return new ActionResult(false, null, reason);
  }

  /**
   * Check if action was successful
   */
  isSuccess() {
    return this.ok === true;
  }

  /**
   * Check if action failed
   */
  isFailure() {
    return this.ok === false;
  }
}
