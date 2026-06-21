using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Commands;

public class RegisterFermentationCommandHandler : IRequestHandler<RegisterFermentationCommand, Guid>
{
    private readonly IBeerRepository _beerRepository;
    private readonly ITankRepository _tankRepository;
    private readonly IFermentationRecordRepository _fermentationRecordRepository;

    public RegisterFermentationCommandHandler(IBeerRepository beerRepository, ITankRepository tankRepository,
        IFermentationRecordRepository fermentationRecordRepository)
    {
        _beerRepository = beerRepository;
        _tankRepository = tankRepository;
        _fermentationRecordRepository = fermentationRecordRepository;
    }

    public async Task<Guid> Handle(RegisterFermentationCommand request, CancellationToken cancellationToken)
    {
        // Busca a cerveja para obter os limites
        var beer = await _beerRepository.GetByIdAsync(request.BeerId);
        if (beer == null)
        {
            throw new Exception("A cerveja informada não foi encontrada no catálogo.");
        }

        // Valida se o tanque de destino existe
        var tank = await _tankRepository.GetByIdAsync(request.TankId);
        if (tank == null)
        {
            throw new Exception("O tanque informado não está disponível.");
        }

        // Converte o momento atual para o fuso horário de Brasília (UTC-3).
        // Suporta Windows ("E. South America Standard Time") e Linux ("America/Sao_Paulo").
        var brazilZone = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "E. South America Standard Time"
                : "America/Sao_Paulo"
        );
        var brazilNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brazilZone);

        // Ao instanciar o FermentationRecord, o cálculo de status é executado
        // automaticamente no construtor da entidade
        var record = new FermentationRecord(
            request.BeerId,
            request.TankId,
            request.BatchNumber,
            request.Temperature,
            request.Ph,
            request.Extract,
            request.Notes,
            brazilNow,
            beer
        );

        await _fermentationRecordRepository.AddAsync(record);

        return record.Id;
    }
}