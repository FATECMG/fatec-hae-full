export enum ComplianceModel {
  PRESENTIAL = 'PRESENCIAL',
  REMOTE = 'REMOTO',
  HYBRID = 'HÍBRIDO',
  TO_BE_DEFINED = 'A DEFINIR',
}
/**
 * Status represents the project situation in every step of the process.
 * It is used to track the project status and to inform the user about the current situation of the project.
 *
 * DRAFT: The project is being created and is not ready to be submitted.
 *
 * SUBMITTED: The project was submitted to a notice and is waiting for validation.
 *
 * UNDER_VALIDATION: The project is being validated by the school academic department.
 *
 * RETURNED_FOR_CORRECTION: The project was rejected and needs to be corrected by the author.
 *
 * APPROVED: The project was approved by the school academic department.
 *
 * REJECTED: The project was rejected and needs to be corrected by the author.
 * The REJECTED status is used when the project is not approved by the school academic department or the other professors.
*/
export enum Status {
  DRAFT = 'RASCUNHO',
  APPROVED = 'APROVADO',
  REJECTED = 'REJEITADO',
  SENT = 'ENVIADO',
  UNDER_VALIDATION = 'EM VALIDAÇÃO',
  RETURNED_FOR_CORRECTION = 'DEVOLVIDO PARA AJUSTES',
}
