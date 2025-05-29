import { StatusNotValid, StatusNotValidChange } from "@common/error/StatusError"
import { findMatchingEnumValue } from "@common/validation/EnumValueValidation"
import { Status } from "@functions/project/entities/enums/ProjectEnums"
  /**
   * Validates whether a status update is valid based on the current status and the new status.
   *
   * @param {string} currentStatus - The current status of the update.
   * @param {string} newStatus - The new status to update to.
   * @returns {boolean} Whether the status update is valid or not.
  */

export const StatusUtil = {

    isValidChange: (currentStatus: string, newStatus: string): boolean => {
        if (newStatus === Status.DRAFT) return false

    if (currentStatus === Status.DRAFT) {
      if (newStatus !== Status.SENT) return false
      else return true
    }

    if (currentStatus === Status.SENT) {
      if (newStatus !== Status.UNDER_VALIDATION) return false
      else return true
    }

    if (currentStatus === Status.UNDER_VALIDATION) {
      if (newStatus === Status.DRAFT || newStatus === Status.SENT || newStatus === Status.UNDER_VALIDATION) return false
      else return true
    }

    if (currentStatus === Status.RETURNED_FOR_CORRECTION) {
      if (newStatus !== Status.SENT) return false
      else return true
    }

    if (currentStatus === Status.APPROVED) {
      if (newStatus === Status.REJECTED || newStatus === Status.RETURNED_FOR_CORRECTION) return true
      else return false
    }

    if (currentStatus === Status.REJECTED) {
      if (newStatus === Status.APPROVED || newStatus === Status.RETURNED_FOR_CORRECTION) return true
      else return false
    }

    return false
    },

    throwErrorIfInvalidStatusChange (currentStatus: string, newStatus: string): void {
        const isInvalidChange = !this.isValidChange(currentStatus, newStatus)
        if (isInvalidChange) 
            throw new StatusNotValidChange()
        
    },

    validateStatus (status: string): void {
        const isStatusValid = !!findMatchingEnumValue(status, Status)
        if (!isStatusValid) throw new StatusNotValid()
    }

}