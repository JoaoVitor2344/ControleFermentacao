using ControleFermentacaoCervejeira.Domain.Enums;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetFermentationSummaryQuery : IRequest<FermentationSummaryDto>
{
}