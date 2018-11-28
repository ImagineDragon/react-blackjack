using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using blackjack_WebAPI.Models;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using Microsoft.AspNet.SignalR.Hubs;

namespace blackjack_WebAPI.Hubs
{
    //[EnableCors("*", "*", "*")]
    public class PlayHub : Hub
    {
        static List<HubProfile> Profiles = new List<HubProfile>();

        UserContext db = new UserContext();
        
        public void Connect (string userId)
        {
            if (!Profiles.Any(x => x.id == userId))
            {
                User users = db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (users == null) return;
                HubProfile newUser = new HubProfile { connectionId = Context.ConnectionId, id = userId, name = users.Name, email = users.Email, bet = users.Bet };
                Profiles.Add(newUser);

                Clients.Caller.onConnected(Profiles);

                Clients.AllExcept(Context.ConnectionId).onNewUserConnected(newUser);
            }
            else
            {
                int index = Profiles.FindIndex(x => x.id == userId);
                Profiles[index].connectionId = Context.ConnectionId;

                Clients.Caller.onConnected(Profiles);

                //Clients.AllExcept(Context.ConnectionId).onNewUserConnected(null);
            }
        }        

        public override Task OnDisconnected(bool stopCalled)
        {
            System.Threading.Thread.Sleep(1000);

            var profile = Profiles.FirstOrDefault(u => u.connectionId == Context.ConnectionId);
            if (profile != null)
            {
                Profiles.Remove(profile);
                Clients.All.onUserDisconnected(profile);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}