using System.Threading.Tasks;
using SimpleApps.ToDo.Domain;

namespace SimpleApps.ToDo.Domain.Services.Interfaces
{
    public interface IMailService
    {
        Task SendPasswordResetMail(User user);
        Task SendActivationEmail(User user);
        Task SendCreationEmail(User user);
    }
}
