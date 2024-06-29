using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using AbpCompanyName.AbpProjectName.Authentication.JwtBearer;
using AbpCompanyName.AbpProjectName.Authorization;
using AbpCompanyName.AbpProjectName.Authorization.Users;
using AbpCompanyName.AbpProjectName.Models.TokenAuth;
using AbpCompanyName.AbpProjectName.MultiTenancy;
using Abp.Runtime.Session;
using Abp.Runtime.Caching;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using AbpCompanyName.AbpProjectName.Authorization.Impersonation;
using Abp.Extensions;
using Abp.UI;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;
using AbpCompanyName.AbpProjectName.Authorization.Roles;

namespace AbpCompanyName.AbpProjectName.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TokenAuthController : AbpProjectNameControllerBase
    {
        private readonly LogInManager _logInManager;
        private readonly ITenantCache _tenantCache;
        private readonly ICacheManager _cacheManager;
        private readonly UserManager _userManager;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly TokenAuthConfiguration _configuration;
        private readonly IOptions<JwtBearerOptions> _jwtOptions;
        private readonly IJwtSecurityStampHandler _securityStampHandler;
        private readonly IImpersonationManager _impersonationManager;
        private readonly AbpUserClaimsPrincipalFactory<User, Role> _claimsPrincipalFactory;

        public TokenAuthController(
            LogInManager logInManager,
            ITenantCache tenantCache,
            ICacheManager cacheManager,
            UserManager userManager,
            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            TokenAuthConfiguration configuration,
            IOptions<JwtBearerOptions> jwtOptions,
            IJwtSecurityStampHandler securityStampHandler,
            IImpersonationManager impersonationManager,
            AbpUserClaimsPrincipalFactory<User, Role> claimsPrincipalFactory)
        {
            _logInManager = logInManager;
            _tenantCache = tenantCache;
            _cacheManager = cacheManager;
            _userManager = userManager;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _configuration = configuration;
            _jwtOptions = jwtOptions;
            _securityStampHandler = securityStampHandler;
            _impersonationManager = impersonationManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
        }

        [HttpPost]
        public async Task<AuthenticateResultModel> Authenticate([FromBody] AuthenticateModel model)
        {
            var loginResult = await GetLoginResultAsync(
                model.UserNameOrEmailAddress,
                model.Password,
                GetTenancyNameOrNull()
            );

            var accessToken = CreateAccessToken(await CreateJwtClaims(loginResult.Identity, loginResult.User));
            var refreshToken = CreateRefreshToken(await CreateJwtClaims(loginResult.Identity,
                                                                        loginResult.User,
                                                                        tokenType: Authentication.JwtBearer.TokenType.RefreshToken,
                                                                        refreshTokenKey: AbpProjectNameConsts.RefreshTokenValidityKey));

            return new AuthenticateResultModel
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.token,
                EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                ExpireInSeconds = (int)_configuration.AccessTokenExpiration.TotalSeconds,
                UserId = loginResult.User.Id
            };
        }


        [HttpPost]
        public async Task<ImpersonatedAuthenticateResultModel> ImpersonatedAuthenticate(string impersonationToken)
        {
            var result = await _impersonationManager.GetImpersonatedUserAndIdentity(impersonationToken);
            var accessToken = CreateAccessToken(await CreateJwtClaims(result.Identity, result.User));
            var refreshToken = CreateRefreshToken(await CreateJwtClaims(result.Identity,
                                                                       result.User,
                                                                       tokenType: Authentication.JwtBearer.TokenType.RefreshToken,
                                                                       refreshTokenKey: AbpProjectNameConsts.RefreshTokenValidityKey));
            return new ImpersonatedAuthenticateResultModel
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.token,
                EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                ExpireInSeconds = (int)_configuration.AccessTokenExpiration.TotalSeconds
            };
        }
        [HttpPost]
        public async Task<RefreshTokenResult> RefreshToken(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                throw new ArgumentNullException(nameof(refreshToken));
            }

            if (!IsRefreshTokenValid(refreshToken, out var principal))
            {
                throw new ValidationException("Refresh token is not valid!");
            }

            try
            {
                var user = await _userManager.GetUserAsync(principal);

                if (user == null)
                {
                    throw new UserFriendlyException("Unknown user or user identifier");
                }

                principal = await _claimsPrincipalFactory.CreateAsync(user);
                var accessToken = CreateAccessToken(await CreateJwtClaims(principal.Identity as ClaimsIdentity, user));

                return await Task.FromResult(new RefreshTokenResult(
                    accessToken,
                    GetEncryptedAccessToken(accessToken),
                    (int)_configuration.AccessTokenExpiration.TotalSeconds)
                );
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new ValidationException("Refresh token is not valid!", e);
            }
        }
        [HttpGet]
        public async Task LogOut()
        {
            if (AbpSession.UserId != null)
            {
                var tokenValidityKeyInClaims = User.Claims.First(c => c.Type == AbpProjectNameConsts.TokenValidityKey);
                await RemoveTokenAsync(tokenValidityKeyInClaims.Value);

                var refreshTokenValidityKeyInClaims =
                    User.Claims.FirstOrDefault(c => c.Type == AbpProjectNameConsts.RefreshTokenValidityKey);
                if (refreshTokenValidityKeyInClaims != null)
                {
                    await RemoveTokenAsync(refreshTokenValidityKeyInClaims.Value);
                }
                await _securityStampHandler.RemoveSecurityStampCacheItem(
                    AbpSession.TenantId,
                    AbpSession.GetUserId()
                );
            }
        }

        private async Task RemoveTokenAsync(string tokenKey)
        {
            await _userManager.RemoveTokenValidityKeyAsync(
                await _userManager.GetUserByIdAsync(AbpSession.UserId ?? 0), tokenKey
            );

            await _cacheManager.GetCache(AbpProjectNameConsts.TokenValidityKey).RemoveAsync(tokenKey);
        }

        private (string token, string key) CreateRefreshToken(IEnumerable<Claim> claims)
        {
            var claimsList = claims.ToList();
            return (CreateToken(claimsList, AbpProjectNameConsts.RefreshTokenExpiration),
                claimsList.First(c => c.Type == AbpProjectNameConsts.TokenValidityKey).Value);
        }
        private string CreateToken(IEnumerable<Claim> claims, TimeSpan? expiration = null)
        {
            var now = DateTime.UtcNow;

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _configuration.Issuer,
                audience: _configuration.Audience,
                claims: claims,
                notBefore: now,
                signingCredentials: _configuration.SigningCredentials,
                expires: expiration == null ? (DateTime?)null : now.Add(expiration.Value)
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }
        private string GetTenancyNameOrNull()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }

            return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
        }

        private async Task<AbpLoginResult<Tenant, User>> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _logInManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    return loginResult;
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        private string CreateAccessToken(IEnumerable<Claim> claims, TimeSpan? expiration = null)
        {
            var now = DateTime.UtcNow;

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _configuration.Issuer,
                audience: _configuration.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(expiration ?? _configuration.AccessTokenExpiration),
                signingCredentials: _configuration.SigningCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }

        private async Task<IEnumerable<Claim>> CreateJwtClaims(
            ClaimsIdentity identity, User user,
            TimeSpan? expiration = null,
            Authentication.JwtBearer.TokenType tokenType = Authentication.JwtBearer.TokenType.AccessToken,
            string refreshTokenKey = null)
        {
            var claims = identity.Claims.ToList();
            var nameIdClaim = claims.First(c => c.Type == ClaimTypes.NameIdentifier);
            var tokenValidityKey = Guid.NewGuid().ToString();
            // Specifically add the jti (random nonce), iat (issued timestamp), and sub (subject/user) claims.
            claims.AddRange(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, nameIdClaim.Value),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim(AbpProjectNameConsts.TokenValidityKey, tokenValidityKey),
                new Claim(AbpProjectNameConsts.UserIdentifier, user.ToUserIdentifier().ToUserIdentifierString()),
                new Claim(AbpProjectNameConsts.TokenType, tokenType.To<int>().ToString())
            });
            if (!string.IsNullOrEmpty(refreshTokenKey))
            {
                claims.Add(new Claim(AbpProjectNameConsts.RefreshTokenValidityKey, refreshTokenKey));
            }

            if (!expiration.HasValue)
            {
                expiration = tokenType == Authentication.JwtBearer.TokenType.AccessToken
                    ? _configuration.AccessTokenExpiration
                    : _configuration.RefreshTokenExpiration;
            }
            var expirationDate = DateTime.UtcNow.Add(expiration.Value);

            await _cacheManager
                .GetCache(AbpProjectNameConsts.TokenValidityKey)
                .SetAsync(tokenValidityKey, "", absoluteExpireTime: new DateTimeOffset(expirationDate));

            await _userManager.AddTokenValidityKeyAsync(
                user,
                tokenValidityKey,
                expirationDate
            );
            return claims;
        }
        private bool IsRefreshTokenValid(string refreshToken, out ClaimsPrincipal principal)
        {
            principal = null;

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidAudience = _configuration.Audience,
                    ValidIssuer = _configuration.Issuer,
                    IssuerSigningKey = _configuration.SecurityKey
                };

                foreach (var validator in _jwtOptions.Value.SecurityTokenValidators)
                {
                    if (!validator.CanReadToken(refreshToken))
                    {
                        continue;
                    }

                    try
                    {
                        principal = validator.ValidateToken(refreshToken, validationParameters, out _);

                        if (principal.Claims.FirstOrDefault(x => x.Type == AbpProjectNameConsts.TokenType)?.Value ==
                            Authentication.JwtBearer.TokenType.RefreshToken.To<int>().ToString())
                        {
                            return true;
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.Debug(ex.ToString(), ex);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Debug(ex.ToString(), ex);
            }

            return false;
        }
        private string GetEncryptedAccessToken(string accessToken)
        {
            return SimpleStringCipher.Instance.Encrypt(accessToken);
        }
    }
}
