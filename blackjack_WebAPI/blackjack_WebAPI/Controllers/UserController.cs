using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using blackjack_WebAPI.Models;
using blackjack_WebAPI.Helpers;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using System.Net.Http;
using System.Net;
using System.Security.Claims;

namespace blackjack_WebAPI.Controllers
{
    [EnableCors("*", "*", "*")]
    public class UserController : ApiController
    {
        private UserContext db = new UserContext();

        public IEnumerable<User> GetUsers()
        {
            return db.Users;
        }

        [HttpPost]
        [AllowAnonymous]
        public object Post(Auth auth)
        {
            var pairs = new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>( "grant_type", "password" ),
                        new KeyValuePair<string, string>( "username", auth.Email ),
                        new KeyValuePair<string, string> ( "Password", auth.Password )
                    };
            var content = new FormUrlEncodedContent(pairs);
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
            using (var client = new HttpClient())
            {
                var response = client.PostAsync("http://blackjackwebapitest.us-west-2.elasticbeanstalk.com/Token", content).Result;
                var result = response.Content.ReadAsStringAsync().Result;
                string password = HashHelper.GetHashString(auth.Password);
                User user = db.Users.FirstOrDefault(u => u.Email == auth.Email && u.Password == password);
                int id = user == null ? -1 : user.Id;
                return new { token = response.Content.ReadAsStringAsync().Result , id};
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public Registration Registration(Registration reg)
        {
            User user = db.Users.FirstOrDefault(u => u.Email == reg.Email);

            if (user != null)
            {
                return null;
            }

            User addUser = new User { Name = reg.Name, Email = reg.Email, Password = HashHelper.GetHashString(reg.Password), Cash = 1500 };

            db.Users.Add(addUser);
            db.SaveChanges();

            return reg;
        }

        [HttpGet]
        [Authorize]
        public Profile Profile()
        {
            var identity = (ClaimsPrincipal)Thread.CurrentPrincipal;
            
            int id = Int32.Parse(identity.Claims.Where(c => c.Type == "id")
                               .Select(c => c.Value).SingleOrDefault());

            User user = db.Users.FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return null;
            }

            //const string accountSid = "ACbddc39e446508fe2298d2788022444aa";
            //const string authToken = "399b4f466badd23be3a42325bf33cc81";

            //TwilioClient.Init(accountSid, authToken);

            //var message = MessageResource.Create(
            //    body: "Ку",
            //    from: new Twilio.Types.PhoneNumber("+12282000870"),
            //    to: new Twilio.Types.PhoneNumber("+380")
            //    );

            Profile profile = new Profile { id = id, name = user.Name, email = user.Email, cash = user.Cash };

            return profile;
        }

        [HttpPut]
        [Authorize]
        public User PlayUser(UpdateData update)
        {
            var identity = (ClaimsPrincipal)Thread.CurrentPrincipal;

            int id = Int32.Parse(identity.Claims.Where(c => c.Type == "id")
                               .Select(c => c.Value).SingleOrDefault());

            User user = db.Users.FirstOrDefault(u => u.Id == id);

            user.Cash = update.cash;
            db.SaveChanges();

            return user;
        }
    }
}
