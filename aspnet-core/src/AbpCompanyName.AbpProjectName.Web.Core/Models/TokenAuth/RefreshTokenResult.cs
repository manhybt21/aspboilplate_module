using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbpCompanyName.AbpProjectName.Models.TokenAuth
{
    public class RefreshTokenResult
    {
        public string AccessToken { get; set; }

        public string EncryptedAccessToken { get; set; }

        public int ExpireInSeconds { get; set; }

        public RefreshTokenResult(string accessToken, string encryptedAccessToken, int expireInSeconds)
        {
            AccessToken = accessToken;
            ExpireInSeconds = expireInSeconds;
            EncryptedAccessToken = encryptedAccessToken;
        }

        public RefreshTokenResult()
        {

        }
    }
}
