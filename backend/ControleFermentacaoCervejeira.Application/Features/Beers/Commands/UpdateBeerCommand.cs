using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Beers.Commands;

public class UpdateBeerCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public decimal MinTemperature { get; set; }
    public decimal MaxTemperature { get; set; }
    public decimal MinPh { get; set; }
    public decimal MaxPh { get; set; }
    public decimal MinExtract { get; set; }
    public decimal MaxExtract { get; set; }
}