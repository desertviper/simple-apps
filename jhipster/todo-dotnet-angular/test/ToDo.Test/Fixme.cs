using SimpleApps.ToDo.Infrastructure.Data;
using SimpleApps.ToDo.Domain;
using SimpleApps.ToDo.Test.Setup;

namespace SimpleApps.ToDo.Test
{
    public static class Fixme
    {
        public static User ReloadUser<TEntryPoint>(AppWebApplicationFactory<TEntryPoint> factory, User user)
            where TEntryPoint : class
        {
            var applicationDatabaseContext = factory.GetRequiredService<ApplicationDatabaseContext>();
            applicationDatabaseContext.Entry(user).Reload();
            return user;
        }
    }
}
