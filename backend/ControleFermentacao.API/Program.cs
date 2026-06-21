using ControleFermentacao.API.Middlewares;
using ControleFermentacao.Application;
using ControleFermentacao.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Conectando as camadas da arquitetura
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Configuração padrão da API (Swagger)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Lê a URL do frontend do appsettings.json em vez de manter hardcoded no código.
// Em produção, sobrescrever via variável de ambiente: AllowedOrigins=https://app.exemplo.com
var allowedOrigins = builder.Configuration["AllowedOrigins"]
    ?? throw new InvalidOperationException("Configuração 'AllowedOrigins' não encontrada.");

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// O middleware de exceções deve ser o primeiro da pipeline para capturar
// erros de qualquer etapa posterior (CORS, autorização, controllers)
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("FrontendPolicy");
app.MapControllers();

app.Run();
