using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using blackjack_WebAPI.Models;

namespace blackjack_WebAPI.Controllers
{
    [EnableCors("*", "*", "*")]
    public class UserController : ApiController
    {
        private UserContext db = new UserContext();

        static string GetHashString(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public IEnumerable<User> GetUsers()
        {
            return db.Users;
        }

        [HttpPost]
        public string Post([FromBody]Auth auth)
        {
            string password = GetHashString(auth.Password);
            User user = db.Users.FirstOrDefault(e => e.Email == auth.Email && e.Password == password);
            if (user != null)
            {
                return user.Id.ToString();
            }
            return null;
        }

        [HttpPost]
        public Registration Registration(Registration reg)
        {
            User user = db.Users.FirstOrDefault(u => u.Email == reg.Email);

            if (user != null)
            {
                return null;
            }

            User addUser = new User { Name = reg.Name, Email = reg.Email, Password = GetHashString(reg.Password), Bet = 1500 };

            db.Users.Add(addUser);
            db.SaveChanges();

            return reg;
        }

        [HttpPost]
        public ProfilePost Profile(ProfileGet id)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == id.userId);

            if (user == null)
            {
                return null;
            }

            ProfilePost profile = new ProfilePost { Id = id.userId, name = user.Name, email = user.Email, bet = user.Bet };

            return profile;
        }

        [HttpPost]
        public ProfilePost Play(ProfileGet id)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == id.userId);

            if (user == null)
            {
                return null;
            }

            ProfilePost profile = new ProfilePost { Id = id.userId, name = user.Name, email = user.Email, bet = user.Bet };

            return profile;
        }

        [HttpPut]
        public User PlayUser(UpdateData update)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == update.userUpdate);

            user.Bet = update.cash;
            db.SaveChanges();

            return user;
        }
    }
}
