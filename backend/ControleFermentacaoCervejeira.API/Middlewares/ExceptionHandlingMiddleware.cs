using System.Net;
using System.Text.Json;

namespace ControleFermentacaoCervejeira.API.Middlewares;

// Middleware global que intercepta qualquer exceção não tratada na pipeline HTTP.
// Evita a duplicação de try-catch em todos os Controllers e garante respostas
// padronizadas em JSON para qualquer erro inesperado.
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Passa a requisição para o próximo componente da pipeline
            await _next(context);
        }
        catch (Exception ex)
        {
            // Loga o erro com stack trace completo para diagnóstico
            _logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Erros de negócio (ArgumentException, InvalidOperation) retornam 400
        // Qualquer outro erro inesperado retorna 500
        var statusCode = exception is ArgumentException or InvalidOperationException
            ? HttpStatusCode.BadRequest
            : HttpStatusCode.InternalServerError;

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            Error = exception.Message,
            StatusCode = (int)statusCode
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
