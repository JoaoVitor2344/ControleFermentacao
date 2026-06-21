using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetFermentationRecordsByBatchQuery : IRequest<IEnumerable<FermentationRecordDto>>
{
    public string BatchNumber { get; set; }

    public GetFermentationRecordsByBatchQuery(string batchNumber)
    {
        BatchNumber = batchNumber;
    }
}