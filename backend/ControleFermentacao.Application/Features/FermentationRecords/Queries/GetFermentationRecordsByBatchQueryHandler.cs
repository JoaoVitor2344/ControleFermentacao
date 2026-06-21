using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Queries;

public class
    GetFermentationRecordsByBatchQueryHandler : IRequestHandler<GetFermentationRecordsByBatchQuery,
    IEnumerable<FermentationRecordDto>>
{
    private readonly IFermentationRecordRepository _fermentationRecordRepository;

    public GetFermentationRecordsByBatchQueryHandler(IFermentationRecordRepository fermentationRecordRepository)
    {
        _fermentationRecordRepository = fermentationRecordRepository;
    }

    public async Task<IEnumerable<FermentationRecordDto>> Handle(GetFermentationRecordsByBatchQuery request,
        CancellationToken cancellationToken)
    {
        var records = await _fermentationRecordRepository.GetByBatchNumberAsync(request.BatchNumber);

        // Converte a entidade do banco para o DTO (formato limpo)
        return records.Select(r => new FermentationRecordDto
        {
            Id = r.Id,
            Temperature = r.Temperature,
            Ph = r.Ph,
            Extract = r.Extract,
            Notes = r.Notes,
            RecordedAt = r.RecordedAt,
            Status = r.Status.ToString()
        }).ToList();
    }
}