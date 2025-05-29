/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios'
import { format } from 'date-fns'
import * as functions from 'firebase-functions'
import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { DomainError } from '../../../../shared/errors/domain.error'
import { IBusiness } from '../../entities/interfaces.entity'

@injectable()
export class CreateDigitalAccount
  implements IExternal<IBusiness & { authToken: string }, IBusiness> {
  async call(params: IBusiness & { authToken: string }): Promise<IBusiness> {
    const resourceServerURL = functions.config().juno.resource_server_url
    const resourceToken = functions.config().payment.rtoken
    const {
      name,
      cnpj,
      cpf,
      email,
      businessArea = 1003,
      companyType = 'LTDA',
      phone,
      address,
      bank,
      authToken,
    } = params

    const birthDate = format(params.birthDate!.getDate(), 'yyyy-MM-dd')
    const digitalAccountData = {
      type: 'PAYMENT',
      name: name.toUpperCase().trim(),
      document: cnpj.replace(/\D/g, ''),
      email,
      birthDate: birthDate.substring(0, 10),
      businessArea,
      linesOfBusiness: 'Bebidas e Porções',
      companyType,
      legalRepresentative: {
        name: name.toUpperCase().trim(),
        document: cpf.replace(/\D/g, ''),
        birthDate,
      },
      autoApprove: false,
      emailOptOut: true,
      autoTransfer: false,
      phone: phone.replace(/\D/g, ''),
      address: {
        street: address.street,
        number: address.number,
        city: address.city,
        state: address.state,
        postCode: address.postCode.replace(/\D/, ''),
      },
      bankAccount: {
        bankNumber: bank.number,
        agencyNumber: bank.agency,
        accountNumber: bank.account,
        accountHolder: {
          name: name.toUpperCase().trim(),
          document: cpf.replace(/\D/g, ''),
        },
        accountType: 'CHECKING',
      },
    }
    try {
      const { data } = await axios({
        url: `${resourceServerURL}/digital-accounts`,
        method: 'POST',
        data: digitalAccountData,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Api-Version': 2,
          'X-Resource-Token': resourceToken,
        },
      })
      return data
    } catch (error) {
      const [detail] = error.response.data.details
      const errorCode = detail.errorCode
      let message = detail.message
      if (errorCode === '391004') {
        message = 'Conta digital já existe.'
      }
      throw new DomainError({ errorCode, message })
    }
  }
}
