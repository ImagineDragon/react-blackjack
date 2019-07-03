using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Web;

namespace blackjack_WebAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public int Cash { get; set; }
    }

    public class Auth
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    
    public class Profile
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int cash { get; set; }
    }

    public class Registration
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateData
    {
        public int cash { get; set; }
    }

    public class HubProfile
    {
        public string connectionId {get;set;}
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int cash { get; set; }
        public int bet { get; set; }
        public bool ready { get; set; }
        public int handSum { get; set; }
        public dynamic hand { get; set; }
    }

    public class Game
    {
        public HubProfile user1 { get; set; }
        public HubProfile user2 { get; set; }
        public List<Message> messages { get; set; }
        public Timer timer { get; set; }
    }

    public class Message
    {
        public string userName { get; set; }
        public string message { get; set; }
    }
}