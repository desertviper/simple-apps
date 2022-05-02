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
    public class ToDoItemRepository : GenericRepository<ToDoItem, long>, IToDoItemRepository
    {
        public ToDoItemRepository(IUnitOfWork context) : base(context)
        {
        }

        public override async Task<ToDoItem> CreateOrUpdateAsync(ToDoItem toDoItem)
        {
            return await base.CreateOrUpdateAsync(toDoItem);
        }
    }
}
