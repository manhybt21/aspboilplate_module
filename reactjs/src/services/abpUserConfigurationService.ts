import http from './httpService'
import AppConsts from '../lib/appconst'

class AbpUserConfigurationService {
  public async getAll() {
    const result = await http.get(`${AppConsts.remoteServiceBaseUrl}AbpUserConfiguration/GetAll`)
    return result
  }
}

export default new AbpUserConfigurationService()
