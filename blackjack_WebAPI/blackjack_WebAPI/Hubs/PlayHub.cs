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
                User user = db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (user == null) return;
                HubProfile newUser = new HubProfile { connectionId = Context.ConnectionId, id = userId, name = user.Name, email = user.Email, bet = user.Bet, ready = false };
                Profiles.Add(newUser);

                Clients.Caller.onConnected(Profiles);
                Clients.AllExcept(Context.ConnectionId).onNewUserConnected(newUser);
            }
            else
            {
                int index = Profiles.FindIndex(x => x.id == userId);
                Profiles[index].connectionId = Context.ConnectionId;
                Profiles[index].ready = false;

                Clients.Caller.onConnected(Profiles);
                Clients.AllExcept(Profiles[index].connectionId).onUserReady(Profiles[index]);
            }
        }

        public void Ready (string userId)
        {
            int index = Profiles.FindIndex(u => u.id.ToString() == userId);
            Profiles[index].ready = !Profiles[index].ready;

            Clients.AllExcept(Profiles[index].connectionId).onUserReady(Profiles[index]);
        }

        public void AcceptGame (string userId, string enemyId)
        {
            HubProfile user = Profiles.FirstOrDefault(u => u.id.ToString() == userId);
            HubProfile enemy = Profiles.FirstOrDefault(u => u.id.ToString() == enemyId);

            Clients.Client(enemy.connectionId).onGameAccept(user);
        }

        public void Game (string userId, string enemyId)
        {
            HubProfile user = Profiles.FirstOrDefault(u => u.connectionId.ToString() == userId);
            HubProfile enemy = Profiles.FirstOrDefault(u => u.connectionId.ToString() == enemyId);

            Clients.Client(user.connectionId).onGameStart(enemy);
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