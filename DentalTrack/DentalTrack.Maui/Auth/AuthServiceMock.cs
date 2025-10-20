using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.Auth
{
    public class AuthServiceMock : IAuthService
    {

        private const string TokenKey = "auth_token";

        public async Task<bool> LoginAsync(string email, string password, CancellationToken ct = default)
        {
            // MOCK: troque quando ligar no domínio/API
            var ok = !string.IsNullOrWhiteSpace(email) && password == "123";
            if (ok)
                await SecureStorage.SetAsync(TokenKey, Guid.NewGuid().ToString());
            return ok;
        }

        public async Task LogoutAsync()
        {
            SecureStorage.Remove(TokenKey);
            await Task.CompletedTask;
            await Shell.Current.GoToAsync("//Login");
        }

        public async Task<bool> IsAuthenticatedAsync()
        {
            var token = await SecureStorage.GetAsync(TokenKey);
            return !string.IsNullOrEmpty(token);
        }
    }
}
