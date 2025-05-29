/**
 * Status represents the status situation in every step of the process.
 * It is used to track the status status and to inform the user about the current situation of the status.
 *
 * DRAFT: The status is being created and is not ready to be submitted.
 *
 * SUBMITTED: The status was submitted to a notice and is waiting for validation.
 *
 * UNDER_VALIDATION: The status is being validated by the school academic department.
 *
 * RETURNED_FOR_CORRECTION: The status was rejected and needs to be corrected by the author.
 *
 * APPROVED_WITH_CAVEATS: The status was approved with caveats and needs to be corrected by the author.
 *
 * APPROVED: The status was approved by the school academic department.
 *
 * REJECTED: The status was rejected and needs to be corrected by the author.
 * The REJECTED status is used when the status is not approved by the school academic department or the other professors.
*/
export enum Status {
  DRAFT = 'RASCUNHO',
  APPROVED = 'APROVADO',
  REJECTED = 'REJEITADO',
  SENT = 'ENVIADO',
  APPROVED_WITH_CAVEATS = 'APROVADO COM RESSALVAS',
  UNDER_VALIDATION = 'EM VALIDAÇÃO',
  RETURNED_FOR_CORRECTION = 'DEVOLVIDO PARA AJUSTES',
}
