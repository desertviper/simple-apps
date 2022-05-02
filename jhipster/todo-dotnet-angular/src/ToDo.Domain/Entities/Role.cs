using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace SimpleApps.ToDo.Domain
{
    public class Role : IdentityRole<string>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
