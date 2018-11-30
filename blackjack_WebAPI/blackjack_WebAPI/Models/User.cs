using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace blackjack_WebAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Bet { get; set; }
    }

    public class Auth
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ProfileGet
    {
        public string userId { get; set; }
    }

    public class ProfilePost
    {
        public string Id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int bet { get; set; }
    }

    public class Registration
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateData
    {
        public string userUpdate { get; set; }
        public int cash { get; set; }
    }

    public class HubProfile
    {
        public string connectionId {get;set;}
        public string id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int cash { get; set; }
        public int bet { get; set; }
        public bool ready { get; set; }
    }
}