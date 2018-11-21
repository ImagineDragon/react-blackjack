using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using blackjack.Models;

namespace blackjack.Controllers
{
    public class HomeController : Controller
    {
        UserContext db = new UserContext();

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

        public ActionResult Index()
        {
            //User user = new User { Name = "aaa", Email = "aaa@aa.aa", Password = "aaaaaa", Bet = 1500 };
            //db.Users.Add(user);
            //db.Users.Remove(db.Users.FirstOrDefault(e=>e.Email == "aaa@aa.aa"));
            //db.SaveChanges();
            IEnumerable<User> users = db.Users;
            ViewBag.Users = users;
            return View();
        }

        [HttpPost]
        public string Index(Auth auth)
        {
            string password = GetHashString(auth.Password);
            User user = db.Users.FirstOrDefault(e => e.Email == auth.Email && e.Password == password);
            if (user != null)
            {
                return user.Id.ToString();
            }
            Console.WriteLine(auth);
            return null;
        }

        [HttpPost]
        public ActionResult profile(ProfileGet id)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == id.userId);

            if(user == null)
            {
                return null;
            }

            ProfilePost profile = new ProfilePost { name = user.Name, email = user.Email, bet = user.Bet };

            return Json(profile);
        }

        [HttpPost]
        public ActionResult Registration(Registration reg)
        {
            User user = db.Users.FirstOrDefault(u => u.Email == reg.Email);

            if (user != null)
            {
                return null;
            }

            User addUser = new User { Name = reg.Name, Email = reg.Email, Password = GetHashString(reg.Password), Bet = 1500 };

            db.Users.Add(addUser);
            db.SaveChanges();

            return Json(reg);
        }

        [HttpPost]
        public ActionResult Play(ProfileGet id)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == id.userId);

            if(user == null)
            {
                return null;
            }

            ProfilePost profile = new ProfilePost { name = user.Name, email = user.Email, bet = user.Bet };

            return Json(profile);
        }

        [HttpPut]
        public JsonResult PlayUser(UpdateData update)
        {
            User user = db.Users.FirstOrDefault(u => u.Id.ToString() == update.userUpdate);

            user.Bet = update.cash;
            db.SaveChanges();

            return Json(user);
        }
    }
}