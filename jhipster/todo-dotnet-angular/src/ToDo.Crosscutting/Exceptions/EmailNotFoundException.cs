using SimpleApps.ToDo.Crosscutting.Constants;

namespace SimpleApps.ToDo.Crosscutting.Exceptions
{
    public class EmailNotFoundException : BaseException
    {
        public EmailNotFoundException() : base(ErrorConstants.EmailNotFoundType, "Email address not registered")
        {
        }
    }
}
