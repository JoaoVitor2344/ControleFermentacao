using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;

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
            DateTime.UtcNow,
            beer
        );

        await _fermentationRecordRepository.AddAsync(record);

        return record.Id;
    }
}
