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

        static List<Game> PlayProfiles = new List<Game>();

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
            Game game = PlayProfiles.FirstOrDefault(u => u.user1.id.ToString() == userId);
            if(game != null)
            {
                PlayProfiles.Remove(game);
            }

            game = PlayProfiles.FirstOrDefault(u => u.user2.id.ToString() == enemyId);
            if(game != null)
            {
                PlayProfiles.Remove(game);
            }
            game = new Game();
            HubProfile user = Profiles.FirstOrDefault(u => u.id.ToString() == userId);
            HubProfile enemy = Profiles.FirstOrDefault(u => u.id.ToString() == enemyId);

            game.user1 = new HubProfile() { id = user.id, name = user.name, email = user.email, bet = user.bet, cash = user.cash, connectionId = user.connectionId, ready = user.ready };
            game.user2 = new HubProfile() { id = enemy.id, name = enemy.name, email = enemy.email, bet = enemy.bet, cash = enemy.cash, connectionId = enemy.connectionId, ready = enemy.ready };
            game.messages = new List<Message>();

            PlayProfiles.Add(game);

            Clients.Client(enemy.connectionId).onGameAccept(user);
        }

        public void GameStart(string userId)
        {
            HubProfile user;
            HubProfile enemy;

            int index = PlayProfiles.FindIndex(u => u.user1.id.ToString() == userId || u.user2.id.ToString() == userId);
            if(PlayProfiles[index].user1.id == userId)
            {
                PlayProfiles[index].user1.connectionId = Context.ConnectionId;

                user = PlayProfiles[index].user1;
                enemy = PlayProfiles[index].user2;
            } else
            {
                PlayProfiles[index].user2.connectionId = Context.ConnectionId;

                user = PlayProfiles[index].user2;
                enemy = PlayProfiles[index].user1;
            }

            Clients.Caller.onGameStart(user, enemy, PlayProfiles[index].messages);
        }

        public void GameChat(string userId, string message)
        {
            int index = PlayProfiles.FindIndex(x => x.user1.id == userId || x.user2.id == userId);
            HubProfile enemy;
            if(PlayProfiles[index].user1.id == userId)
            {
                enemy = PlayProfiles[index].user2;
                PlayProfiles[index].messages.Add(new Message { userName = PlayProfiles[index].user1.name, message = message });
            } else
            {
                enemy = PlayProfiles[index].user1;
                PlayProfiles[index].messages.Add(new Message { userName = PlayProfiles[index].user2.name, message = message });
            }

            Message mes = PlayProfiles[index].messages[PlayProfiles[index].messages.Count() - 1];

            Clients.Client(enemy.connectionId).onMessage(mes);
        }

        public void UserBet(int cash, int bet)
        {
            HubProfile user;
            HubProfile enemy;
            int index = PlayProfiles.FindIndex(u => u.user1.connectionId.ToString() == Context.ConnectionId || u.user2.connectionId.ToString() == Context.ConnectionId);
            if(PlayProfiles[index].user1.connectionId == Context.ConnectionId)
            {
                PlayProfiles[index].user1.cash = cash;
                PlayProfiles[index].user1.bet = bet;

                user = PlayProfiles[index].user1;
                enemy = PlayProfiles[index].user2;
            }
            else
            {
                PlayProfiles[index].user2.cash = cash;
                PlayProfiles[index].user2.bet = bet;

                user = PlayProfiles[index].user2;
                enemy = PlayProfiles[index].user1;
            }
            
            Clients.Caller.onBet(user);

            Clients.Client(enemy.connectionId).onEnemyBet(user);
        }

        public void StopGame(string userId)
        {
            Game game = PlayProfiles.FirstOrDefault(x => x.user1.id == userId || x.user2.id == userId);
            if (game.user1.id == userId)
            {
                Clients.Client(game.user2.connectionId).onStopGame();
            }
            else
            {
                Clients.Client(game.user1.connectionId).onStopGame();
            }

            PlayProfiles.Remove(game);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            System.Threading.Thread.Sleep(500);

            var profile = Profiles.FirstOrDefault(u => u.connectionId == Context.ConnectionId);
            if (profile != null)
            {
                Profiles.Remove(profile);
                Clients.All.onUserDisconnected(profile);
            }

            var playProfile = PlayProfiles.FirstOrDefault(u => u.user1.connectionId == Context.ConnectionId || u.user2.connectionId == Context.ConnectionId);
            if (playProfile != null)
            {
                PlayProfiles.Remove(playProfile);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}