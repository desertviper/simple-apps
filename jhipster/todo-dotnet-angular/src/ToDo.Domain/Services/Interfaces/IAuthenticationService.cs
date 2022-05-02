using System.Security.Principal;
using System.Threading.Tasks;

namespace SimpleApps.ToDo.Domain.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<IPrincipal> Authenticate(string username, string password);
    }
}
