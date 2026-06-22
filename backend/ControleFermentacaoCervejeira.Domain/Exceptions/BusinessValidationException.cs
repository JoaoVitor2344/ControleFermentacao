namespace ControleFermentacaoCervejeira.Domain.Exceptions;

public class BusinessValidationException : Exception
{
    public IReadOnlyList<string> Errors { get; }

    public BusinessValidationException(string message) : base(message)
    {
        Errors = new[] { message };
    }

    public BusinessValidationException(IEnumerable<string> errors)
        : base(string.Join(" | ", errors))
    {
        Errors = errors.ToList().AsReadOnly();
    }
}
