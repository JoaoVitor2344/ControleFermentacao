using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetAllFermentationBatchesQuery : IRequest<IEnumerable<string>>;
