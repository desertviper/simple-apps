using SimpleApps.ToDo.Crosscutting.Constants;

namespace SimpleApps.ToDo.Crosscutting.Exceptions
{
    public class EmailAlreadyUsedException : BadRequestAlertException
    {
        public EmailAlreadyUsedException() : base(ErrorConstants.EmailAlreadyUsedType, "Email is already in use!",
            "userManagement", "emailexists")
        {
        }
    }
}
