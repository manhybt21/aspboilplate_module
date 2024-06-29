using AbpCompanyName.AbpProjectName.Debugging;
using System;

namespace AbpCompanyName.AbpProjectName
{
    public class AbpProjectNameConsts
    {
        public const string LocalizationSourceName = "AbpProjectName";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "{{DEFAULT_PASS_PHRASE_HERE}}";
        public const string TokenValidityKey = "token_validity_key";
        public const string RefreshTokenValidityKey = "refresh_token_validity_key";
        public const string SecurityStampKey = "AspNet.Identity.SecurityStamp";
        public const string TokenType = "token_type";
        public static string UserIdentifier = "user_identifier";
        public static TimeSpan AccessTokenExpiration = TimeSpan.FromDays(1);
        public static TimeSpan RefreshTokenExpiration = TimeSpan.FromDays(365);
    }
}
