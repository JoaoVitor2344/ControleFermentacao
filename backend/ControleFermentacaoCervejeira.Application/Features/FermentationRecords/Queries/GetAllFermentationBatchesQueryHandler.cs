using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetAllFermentationBatchesQueryHandler : IRequestHandler<GetAllFermentationBatchesQuery, IEnumerable<string>>
{
    private readonly IFermentationRecordRepository _repository;

    public GetAllFermentationBatchesQueryHandler(IFermentationRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<string>> Handle(GetAllFermentationBatchesQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAllBatchNumbersAsync();
    }
}
