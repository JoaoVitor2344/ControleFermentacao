using ControleFermentacao.Domain.Enums;
using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Queries;

public class GetFermentationSummaryQuery : IRequest<FermentationSummaryDto>
{
}