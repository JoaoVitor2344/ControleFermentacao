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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();