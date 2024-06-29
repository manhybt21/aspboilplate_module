
using Abp.Domain.Services;
using AbpReactTemplate.Authorization.Impersonation.Dto;
using System.Threading.Tasks;

namespace AbpCompanyName.AbpProjectName.Authorization.Impersonation
{
    public interface IImpersonationManager : IDomainService
    {
        Task<UserAndIdentity> GetImpersonatedUserAndIdentity(string impersonationToken);

        Task<string> GetImpersonationToken(long userId, int? tenantId);

        Task<string> GetBackToImpersonatorToken();
    }
}
