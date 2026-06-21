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

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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
app.UseCors("FrontendPolicy");
app.MapControllers();

app.Run();