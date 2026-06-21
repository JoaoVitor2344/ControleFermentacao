using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Queries;

public class GetTankByIdQuery : IRequest<Tank?>
{
    public Guid Id { get; set; }

    public GetTankByIdQuery(Guid id)
    {
        Id = id;
    }
}