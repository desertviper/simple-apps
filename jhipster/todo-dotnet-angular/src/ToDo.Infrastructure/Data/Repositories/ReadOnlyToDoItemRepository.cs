using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JHipsterNet.Core.Pagination;
using JHipsterNet.Core.Pagination.Extensions;
using SimpleApps.ToDo.Domain;
using SimpleApps.ToDo.Domain.Repositories.Interfaces;
using SimpleApps.ToDo.Infrastructure.Data.Extensions;

namespace SimpleApps.ToDo.Infrastructure.Data.Repositories
{
    public class ReadOnlyToDoItemRepository : ReadOnlyGenericRepository<ToDoItem, long>, IReadOnlyToDoItemRepository
    {
        public ReadOnlyToDoItemRepository(IUnitOfWork context) : base(context)
        {
        }
    }
}
