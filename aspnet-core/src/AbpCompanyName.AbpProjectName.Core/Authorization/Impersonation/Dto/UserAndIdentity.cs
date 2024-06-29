using AbpCompanyName.AbpProjectName.Authorization.Users;
using System.Security.Claims;

namespace AbpReactTemplate.Authorization.Impersonation.Dto
{
    public class UserAndIdentity
    {
        public User User { get; set; }

        public ClaimsIdentity Identity { get; set; }

        public UserAndIdentity(User user, ClaimsIdentity identity)
        {
            User = user;
            Identity = identity;
        }
    }
}
