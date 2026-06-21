using ControleFermentacaoCervejeira.Domain.Enums;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class GetFermentationSummaryQueryHandler : IRequestHandler<GetFermentationSummaryQuery, FermentationSummaryDto>
{
    private readonly IFermentationRecordRepository _fermentationRecordRepository;

    public GetFermentationSummaryQueryHandler(IFermentationRecordRepository fermentationRecordRepository)
    {
        _fermentationRecordRepository = fermentationRecordRepository;
    }

    public async Task<FermentationSummaryDto> Handle(GetFermentationSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var counts = await _fermentationRecordRepository.GetSummaryAsync();

        // Extrai os valores do Dicionário (se não existir nenhum daquele status, retorna 0)
        int within = counts.GetValueOrDefault(FermentationStatus.WithinPattern, 0);
        int attention = counts.GetValueOrDefault(FermentationStatus.Attention, 0);
        int outOfPattern = counts.GetValueOrDefault(FermentationStatus.OutOfPattern, 0);

        return new FermentationSummaryDto
        {
            TotalRecords = within + attention + outOfPattern,
            WithinPattern = within,
            Attention = attention,
            OutOfPattern = outOfPattern
        };
    }
}