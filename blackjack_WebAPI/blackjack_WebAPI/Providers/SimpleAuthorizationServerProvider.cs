using blackjack_WebAPI.Helpers;
using blackjack_WebAPI.Models;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace blackjack_WebAPI.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            string id;
            using (UserContext db = new UserContext())
            {
                string password = HashHelper.GetHashString(context.Password);

                User user = db.Users.FirstOrDefault(u => u.Email == context.UserName && u.Password == password);
                
                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                } else
                {
                    id = user.Id.ToString();
                }
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("id", id));
            identity.AddClaim(new Claim("role", "user"));

            context.Validated(identity);

        }
    }
}