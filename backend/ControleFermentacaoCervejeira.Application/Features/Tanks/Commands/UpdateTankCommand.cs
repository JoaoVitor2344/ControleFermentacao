using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Commands;

public class UpdateTankCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CapacityLiters { get; set; }
}