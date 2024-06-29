namespace AbpCompanyName.AbpProjectName.Models.TokenAuth
{
    public class ImpersonatedAuthenticateResultModel
    {
        public string AccessToken { get; set; }

        public string EncryptedAccessToken { get; set; }

        public int ExpireInSeconds { get; set; }

        public string RefreshToken { get; set; }
    }
}
