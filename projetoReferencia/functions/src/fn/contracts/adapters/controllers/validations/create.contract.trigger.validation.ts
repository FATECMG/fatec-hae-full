import { Message } from 'firebase-functions/lib/providers/pubsub'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class CreateContractTriggerValidation
  implements ValidationSchema<Message> {
  async validate(message: Message): Promise<ValidationResult<Message>> {
    if (!message.json || !message.json.contract) {
      return generateError('contract is missing in message')
    }
    return generateValidResult(message)
  }
}
