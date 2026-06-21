using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;

public class CreateBeerCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public decimal MinTemperature { get; set; }
    public decimal MaxTemperature { get; set; }
    public decimal MinPh { get; set; }
    public decimal MaxPh { get; set; }
    public decimal MinExtract { get; set; }
    public decimal MaxExtract { get; set; }
}