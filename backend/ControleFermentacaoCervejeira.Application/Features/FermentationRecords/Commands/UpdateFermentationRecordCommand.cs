using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;

public class UpdateFermentationRecordCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public decimal Temperature { get; set; }
    public decimal Ph { get; set; }
    public decimal Extract { get; set; }
    public string Notes { get; set; } = string.Empty;
}
