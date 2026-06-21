using ControleFermentacaoCervejeira.Domain.Entities;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Queries;

public class GetTankByIdQuery : IRequest<Tank?>
{
    public Guid Id { get; set; }

    public GetTankByIdQuery(Guid id)
    {
        Id = id;
    }
}