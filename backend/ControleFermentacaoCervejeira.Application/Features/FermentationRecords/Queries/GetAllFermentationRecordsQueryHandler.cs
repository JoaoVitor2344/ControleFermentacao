using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetAllFermentationRecordsQueryHandler
    : IRequestHandler<GetAllFermentationRecordsQuery, PagedResultDto<FermentationRecordDto>>
{
    private readonly IFermentationRecordRepository _repository;

    public GetAllFermentationRecordsQueryHandler(IFermentationRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResultDto<FermentationRecordDto>> Handle(
        GetAllFermentationRecordsQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repository.GetAllPagedAsync(
            request.Page, request.PageSize,
            request.BeerId, request.TankId, request.BatchNumber, request.Status, request.Ascending);

        var dtos = items.Select(r => new FermentationRecordDto
        {
            Id = r.Id,
            BatchNumber = r.BatchNumber,
            Temperature = r.Temperature,
            Ph = r.Ph,
            Extract = r.Extract,
            Notes = r.Notes,
            RecordedAt = r.RecordedAt,
            Status = r.Status.ToString()
        });

        return new PagedResultDto<FermentationRecordDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
