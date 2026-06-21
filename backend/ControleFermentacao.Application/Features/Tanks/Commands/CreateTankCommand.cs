using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Commands;

public class CreateTankCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
}