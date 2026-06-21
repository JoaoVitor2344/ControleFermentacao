using ControleFermentacaoCervejeira.Domain.Interfaces;
using ControleFermentacaoCervejeira.Infrastructure.Data.Context;
using ControleFermentacaoCervejeira.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ControleFermentacaoCervejeira.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Configuração do Contexto do Banco de Dados (PostgreSQL)
        // Ele vai buscar a string de conexão no appsettings.json da API depois
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // 2. Registro dos Repositórios no contêiner
        // Usamos AddScoped para que a mesma instância do contexto seja usada durante toda a requisição HTTP
        services.AddScoped<IBeerRepository, BeerRepository>();
        services.AddScoped<ITankRepository, TankRepository>();
        services.AddScoped<IFermentationRecordRepository, FermentationRecordRepository>();

        return services;
    }
}