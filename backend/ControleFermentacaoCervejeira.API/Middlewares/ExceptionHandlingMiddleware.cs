using System.Net;
using System.Text.Json;
using ControleFermentacaoCervejeira.Domain.Exceptions;

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

        var (statusCode, errors) = exception switch
        {
            NotFoundException => (HttpStatusCode.NotFound, new[] { exception.Message }),
            BusinessValidationException bve => (HttpStatusCode.BadRequest, bve.Errors.ToArray()),
            ArgumentException or InvalidOperationException => (HttpStatusCode.BadRequest, new[] { exception.Message }),
            _ => (HttpStatusCode.InternalServerError, new[] { "Ocorreu um erro interno no servidor." })
        };

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            Error = exception.Message,
            Errors = errors,
            StatusCode = (int)statusCode
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
