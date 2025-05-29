import { type Project } from '@functions/project/entities/Project'

/**
 * Orders an array of projects by their send date in descending order.
 * If the send date is undefined, the project will be ordered before the project with a defined send date.
 *
 * @param {Project[]} projects - The array of projects to order.
 * @returns {Project[]} The ordered array of projects.
 */
export function orderProjectBySendDate (projects: Project[]): Project[] {
  return projects.sort((firstProject, secondProject) => {
    // If firstProject.sendDate and secondProject.sendDate are undefined, they are ordered the same
    if (sendDateIsUndefined(firstProject.sendDate) && sendDateIsUndefined(secondProject.sendDate)) {
      return SortOrder.SAME
    }
    // If firstProject.sendDate is undefined, it will be ordered before secondProject
    if (sendDateIsUndefined(firstProject.sendDate)) {
      return SortOrder.FIRST_BEFORE_SECOND
    }
    // If secondProject.sendDate is undefined, it will be ordered before firstProject
    if (sendDateIsUndefined(secondProject.sendDate)) {
      return SortOrder.SECOND_BEFORE_FIRST
    }
    const dateA = new Date(firstProject.sendDate.split('/').reverse().join('-'))
    const dateB = new Date(secondProject.sendDate.split('/').reverse().join('-'))
    // If both has sendDates, they are ordered by their send date
    return dateB.getTime() - dateA.getTime()
  })
}

function sendDateIsUndefined (sendDate?: string): sendDate is undefined {
  return sendDate === undefined
}

enum SortOrder {
  SAME = 0,
  FIRST_BEFORE_SECOND = -1,
  SECOND_BEFORE_FIRST = 1
}
