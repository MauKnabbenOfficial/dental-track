using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.Auth
{
    public interface IAuthService
    {
        Task<bool> LoginAsync(string email, string password, CancellationToken ct = default);
        Task LogoutAsync();
        Task<bool> IsAuthenticatedAsync();
    }
}
