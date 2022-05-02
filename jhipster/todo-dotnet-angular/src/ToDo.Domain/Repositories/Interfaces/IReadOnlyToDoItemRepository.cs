namespace SimpleApps.ToDo.Domain.Repositories.Interfaces
{

    public interface IReadOnlyToDoItemRepository : IReadOnlyGenericRepository<ToDoItem, long>
    {
    }

}
