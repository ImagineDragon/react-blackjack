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

        static List<HubProfile> PlayProfiles = new List<HubProfile>();

        UserContext db = new UserContext();

        public void Connect(string userId)
        {
            if (!Profiles.Any(x => x.id == userId))
            {
                User user = db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
                if (user == null) return;
                HubProfile newUser = new HubProfile { connectionId = Context.ConnectionId, id = userId, name = user.Name, email = user.Email, cash = user.Bet, bet = 0, ready = false };
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

        public void Ready(string userId, bool ready)
        {
            int index = Profiles.FindIndex(u => u.id.ToString() == userId);
            Profiles[index].ready = ready;

            Clients.AllExcept(Profiles[index].connectionId).onUserReady(Profiles[index]);
        }

        public void AcceptGame(string userId, string enemyId)
        {
            HubProfile user = PlayProfiles.FirstOrDefault(u => u.id.ToString() == userId);
            if(user != null)
            {
                PlayProfiles.Remove(user);
            }

            HubProfile enemy = PlayProfiles.FirstOrDefault(u => u.id.ToString() == enemyId);
            if(enemy != null)
            {
                PlayProfiles.Remove(enemy);
            }

            HubProfile user1 = Profiles.FirstOrDefault(u => u.id.ToString() == userId);
            HubProfile enemy1 = Profiles.FirstOrDefault(u => u.id.ToString() == enemyId);

            user = new HubProfile() { id = user1.id, name = user1.name, email = user1.email, bet = user1.bet, cash = user1.cash, connectionId = user1.connectionId, ready = user1.ready };
            enemy = new HubProfile() { id = enemy1.id, name = enemy1.name, email = enemy1.email, bet = enemy1.bet, cash = enemy1.cash, connectionId = enemy1.connectionId, ready = enemy1.ready };

            PlayProfiles.Add(user);
            PlayProfiles.Add(enemy);

            Clients.Client(enemy.connectionId).onGameAccept(user);
        }

        public void GameStart(string userId, string enemyId)
        {
            int index = PlayProfiles.FindIndex(u => u.id.ToString() == userId);
            PlayProfiles[index].connectionId = Context.ConnectionId;

            HubProfile user = PlayProfiles[index];
            HubProfile enemy = PlayProfiles.FirstOrDefault(u => u.id.ToString() == enemyId);

            Clients.Caller.onGameStart(user, enemy);
        }

        public void GameChat(string userName, string message, string enemyId)
        {
            HubProfile enemy = PlayProfiles.FirstOrDefault(x => x.id == enemyId);
            Messages mes = new Messages{ userName = userName, message = message };

            Clients.Client(enemy.connectionId).onMessage(mes);
        }

        public void UserBet(int cash, int bet, string enemyId)
        {
            int index = PlayProfiles.FindIndex(u => u.connectionId.ToString() == Context.ConnectionId);
            Profiles.FirstOrDefault();
            PlayProfiles[index].cash = cash;
            PlayProfiles[index].bet = bet;

            HubProfile user = PlayProfiles[index];
            HubProfile enemy = PlayProfiles.FirstOrDefault(u => u.id.ToString() == enemyId);

            Clients.Caller.onBet(user);

            Clients.Client(enemy.connectionId).onEnemyBet(user);
        }

        public void StopGame(string userId, string enemyId)
        {
            PlayProfiles.Remove(PlayProfiles.FirstOrDefault(x => x.id == userId));

            HubProfile enemy = PlayProfiles.FirstOrDefault(x => x.id == enemyId);
            if(enemy != null) Clients.Client(enemy.connectionId).onStopGame();
        }

        public override Task OnDisconnected(bool stopCalled)
        {

            System.Threading.Thread.Sleep(500);

            var playProfile = PlayProfiles.FirstOrDefault(u => u.connectionId == Context.ConnectionId);
            var profile = Profiles.FirstOrDefault(u => u.connectionId == Context.ConnectionId);
            if (profile != null)
            {
                Profiles.Remove(profile);
                Clients.All.onUserDisconnected(profile);
            }

            if (playProfile != null)
            {
                PlayProfiles.Remove(profile);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}