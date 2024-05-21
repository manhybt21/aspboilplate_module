import { Component, Vue } from 'vue-property-decorator';
import appconst from './appconst';

@Component
export default class AbpBase extends Vue {
  L(value: string, source?: string, ...args: string[]): string {
    if (source) {
      return window.abp.localization.localize(value, source, ...args);
    } else {
      return window.abp.localization.localize(value, appconst.localization.defaultLocalizationSourceName, ...args);
    }
  }

  hasPermission(permissionName: string): boolean {
    return window.abp.auth.hasPermission(permissionName);
  }

  hasAnyOfPermissions(...args: string[]): boolean {
    return window.abp.auth.hasAnyOfPermissions(...args);
  }

  hasAllOfPermissions(...args: string[]): boolean {
    return window.abp.auth.hasAllOfPermissions(...args);
  }
}
