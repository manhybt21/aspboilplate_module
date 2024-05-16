import { L } from '../../lib/abpUtility'

const rules = {
  userNameOrEmailAddress: [
    {
      required: true,
      message: L('PleaseEnterLoginInformation'),
    },
  ],
  password: [{ required: true, message: L('PleaseEnterLoginInformation') }],
}

export default rules
