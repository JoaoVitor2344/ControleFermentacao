using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Commands;

public class DeleteTankCommand : IRequest<bool>
{
    public Guid Id { get; set; }

    public DeleteTankCommand(Guid id)
    {
        Id = id;
    }
}