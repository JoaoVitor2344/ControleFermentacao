using MediatR;
using ControleFermentacaoCervejeira.Domain.Enums;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetAllFermentationRecordsQuery : IRequest<PagedResultDto<FermentationRecordDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public Guid? BeerId { get; set; }
    public Guid? TankId { get; set; }
    public string? BatchNumber { get; set; }
    public FermentationStatus? Status { get; set; }
    public bool Ascending { get; set; } = false;
}
